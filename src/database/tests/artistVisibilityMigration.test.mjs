// SQL validation only: every test uses a fresh in-memory PostgreSQL database.
// See specs/090-artist-profile-studio/091-artist-profile/validation/artist-visibility-migration.md.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// Reuse the backend's pinned SQL test dependency; an external install remains optional.
const requireBackend = createRequire(new URL('../../backend/package.json', import.meta.url));
const { PGlite } = await import(process.env.PGLITE_MODULE_URL || pathToFileURL(requireBackend.resolve('@electric-sql/pglite')).href);
const migration = await readFile(new URL('../migrations/003_artist_visibility.sql', import.meta.url), 'utf8');

// Fixture of the visible Artist fields; no assertion of unseen production FKs.
const fixture = `
  CREATE TABLE public.artists (
    artist_id bigint PRIMARY KEY,
    user_id text,
    name text NOT NULL,
    biography text,
    image_url text,
    created_at timestamptz DEFAULT now()
  );
  INSERT INTO public.artists (artist_id, user_id, name, biography)
    VALUES (1, 'account-a', 'Artist A', 'Existing biography'),
           (9007199254740993, NULL, 'Artist B', NULL);
`;

async function database(t, setup = fixture) {
  const db = new PGlite();
  t.after(() => db.close());
  if (setup) await db.exec(setup);
  return db;
}

test('existing artists and exact bigint keys are preserved without a visibility backfill', async (t) => {
  const db = await database(t);
  const before = await db.query('SELECT artist_id::text, user_id, name, biography, image_url, created_at FROM artists ORDER BY artist_id');
  await db.exec(migration);
  const after = await db.query('SELECT artist_id::text, user_id, name, biography, image_url, created_at FROM artists ORDER BY artist_id');
  assert.deepEqual(after.rows, before.rows);
  assert.equal(after.rows[1].artist_id, '9007199254740993');
  assert.deepEqual((await db.query('SELECT artist_visibility FROM artists')).rows, [
    { artist_visibility: null }, { artist_visibility: null },
  ]);
});

test('new rows default hidden, while explicit public/hidden values are accepted', async (t) => {
  const db = await database(t);
  await db.exec(migration);
  await db.exec(`
    INSERT INTO artists (artist_id, name) VALUES (3, 'New artist');
    INSERT INTO artists (artist_id, name, artist_visibility)
      VALUES (4, 'Reviewed artist', 'public'), (5, 'Hidden artist', 'hidden');
  `);
  assert.deepEqual((await db.query('SELECT artist_visibility FROM artists WHERE artist_id >= 3 AND artist_id <= 5 ORDER BY artist_id')).rows,
    [{ artist_visibility: 'hidden' }, { artist_visibility: 'public' }, { artist_visibility: 'hidden' }]);
});

test('invalid states are rejected without changing the existing row', async (t) => {
  const db = await database(t);
  await db.exec(migration);
  for (const invalid of ['active', 'banned', 'PUBLIC', '', 'private']) {
    await assert.rejects(db.query('UPDATE artists SET artist_visibility = $1 WHERE artist_id = 1', [invalid]),
      (error) => error.code === '23514');
  }
  assert.equal((await db.query('SELECT artist_visibility FROM artists WHERE artist_id = 1')).rows[0].artist_visibility, null);
});

test('explicit public filtering excludes both hidden and legacy-unreviewed rows', async (t) => {
  const db = await database(t);
  await db.exec(migration);
  await db.exec("INSERT INTO artists (artist_id, name) VALUES (3, 'Default hidden'); UPDATE artists SET artist_visibility = 'public' WHERE artist_id = 1;");
  assert.deepEqual((await db.query("SELECT artist_id::text FROM artists WHERE artist_visibility = 'public'")).rows, [{ artist_id: '1' }]);
});

test('adding visibility does not change the existing account schema or banned flags', async (t) => {
  const db = await database(t);
  // Supplied users key/status shape; ancillary auth fields are irrelevant here.
  await db.exec(`
    CREATE TABLE users (user_id text PRIMARY KEY, id text NOT NULL UNIQUE, is_banned boolean NOT NULL DEFAULT false);
    INSERT INTO users VALUES ('account-a', 'legacy-id-a', false), ('account-b', 'legacy-id-b', true);
  `);
  const before = (await db.query('SELECT * FROM users ORDER BY user_id')).rows;
  await db.exec(migration);
  assert.deepEqual((await db.query('SELECT * FROM users ORDER BY user_id')).rows, before);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'account_status'")).rows[0].n, 0);
});

test('a repeated application fails safely instead of overwriting reviewed visibility', async (t) => {
  const db = await database(t);
  await db.exec(migration);
  await db.exec("UPDATE artists SET artist_visibility = 'public' WHERE artist_id = 1");
  await assert.rejects(db.exec(migration), (error) => error.code === '42701');
  await db.exec('ROLLBACK');
  assert.equal((await db.query('SELECT artist_visibility FROM artists WHERE artist_id = 1')).rows[0].artist_visibility, 'public');
});

test('a failure later in the migration rolls back the added column and default', async (t) => {
  const db = await database(t);
  // A conflicting constraint name stands in for a later deployment failure.
  await db.exec('ALTER TABLE artists ADD CONSTRAINT artists_artist_visibility_check CHECK (name IS NOT NULL)');
  await assert.rejects(db.exec(migration), (error) => error.code === '42710');
  await db.exec('ROLLBACK');
  const columns = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'artists' AND column_name = 'artist_visibility'");
  assert.deepEqual(columns.rows, []);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM artists')).rows[0].n, 2);
});

test('missing artists table is a prerequisite error, not a reason to create a guessed schema', async (t) => {
  const db = await database(t, '');
  await assert.rejects(db.exec(migration), (error) => error.code === '42P01');
  await db.exec('ROLLBACK');
  assert.equal((await db.query("SELECT to_regclass('public.artists') AS artists")).rows[0].artists, null);
});
