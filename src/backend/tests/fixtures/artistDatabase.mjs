import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export async function createArtistDatabase() {
  const { PGlite } = await import(process.env.PGLITE_MODULE_URL || '@electric-sql/pglite');
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE TABLE users (user_id text PRIMARY KEY, id text NOT NULL UNIQUE, is_banned boolean NOT NULL DEFAULT false);
      INSERT INTO users VALUES ('account-a', 'different-legacy-id-a', false), ('account-b', 'different-legacy-id-b', true);
      CREATE TABLE artists (artist_id bigint PRIMARY KEY, user_id text, name text NOT NULL, biography text, image_url text, created_at timestamptz DEFAULT now());
      INSERT INTO artists (artist_id, user_id, name, biography) VALUES
        (9007199254740993, 'account-a', 'Public Artist', 'Public biography'),
        (2, NULL, 'Independent Artist', '   '), (3, NULL, 'Hidden secret', 'Hidden bio'),
        (4, NULL, 'Unreviewed secret', NULL), (5, 'account-b', 'Banned secret', NULL),
        (6, 'missing-account', 'Dangling secret', NULL);
    `);
    await db.exec(await readFile(new URL('../../../database/migrations/003_artist_visibility.sql', import.meta.url), 'utf8'));
    await db.exec("UPDATE artists SET artist_visibility = 'public' WHERE artist_id IN (9007199254740993, 2, 5, 6); UPDATE artists SET artist_visibility = 'hidden' WHERE artist_id = 3;");
    await db.exec(await readFile(new URL('../../../database/migrations/004_artist_profile_read_policy.sql', import.meta.url), 'utf8'));
    return db;
  } catch (error) { await db.close(); throw error; }
}

// PostgREST-shaped transport over the real view, not a mock eligibility result.
// Production uses Supabase; SQL/privacy tests use disposable PostgreSQL only.
export function postgresArtistClient(db) {
  return {
    from(table) {
      assert.equal(table, 'artist_profile_public');
      return { select(fields) {
        assert.equal(fields, 'id,name,image_url,biography');
        return { eq(key, id) {
          assert.equal(key, 'id');
          return { async maybeSingle() {
            try {
              const result = await db.query('SELECT id, name, image_url, biography FROM public.artist_profile_public WHERE id = $1', [id]);
              return { data: result.rows[0] || null, error: null };
            } catch (error) { return { data: null, error }; }
          } };
        } };
      } };
    },
  };
}
