import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import { createArtistRepository } from '../repositories/artistRepository.js';
import { createArtistRouter } from '../routes/artistRoutes.js';
import { createArtistDatabase, postgresArtistClient } from './fixtures/artistDatabase.mjs';

let db, server, base;
before(async () => {
  db = await createArtistDatabase();
  const repository = createArtistRepository({ getClient: async () => postgresArtistClient(db) });
  const app = express();
  app.use('/api/v1/artists', createArtistRouter(repository));
  app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found', data: null, error: { code: 'NOT_FOUND', details: [] } }));
  server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  base = `http://127.0.0.1:${server.address().port}/api/v1/artists`;
});
after(async () => { if (server) await new Promise(resolve => server.close(resolve)); await db?.close(); });

test('anonymous identity uses exact bigint text and only the four approved fields', async () => {
  const response = await fetch(`${base}/9007199254740993`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json();
  assert.deepEqual(body, { success: true, message: 'Artist profile loaded', data: {
    id: '9007199254740993', name: 'Public Artist', imageUrl: null, biography: 'Public biography',
  }, error: null });
});

test('unlinked public artist is allowed without an account fallback', async () => {
  const body = await (await fetch(`${base}/2`)).json();
  assert.equal(body.data.name, 'Independent Artist');
  assert.equal(body.data.biography, null);
});

test('hidden, legacy-NULL, banned, dangling-account and unknown have identical safe outcomes for all public paths', async () => {
  for (const suffix of ['', '/songs', '/albums', '/playlists']) {
    const expected = await (await fetch(`${base}/99999${suffix}`)).json();
    for (const id of ['3', '4', '5', '6']) {
      for (const headers of [{}, { Authorization: 'Bearer artist-role' }, { Authorization: 'Bearer admin-role' }]) {
        const response = await fetch(`${base}/${id}${suffix}`, { headers });
        assert.equal(response.status, 404);
        assert.deepEqual(await response.json(), expected);
      }
    }
  }
});

test('canonical signed bigint boundaries are accepted, malformed/out-of-range identifiers are safe 400', async () => {
  for (const id of ['0', '-9223372036854775808', '9223372036854775807']) {
    assert.equal((await fetch(`${base}/${id}`)).status, 404);
  }
  for (const id of ['abc', '01', '-0', '9223372036854775808', '-9223372036854775809', '%ZZ', '1%2F2']) {
    const response = await fetch(`${base}/${id}`);
    assert.equal(response.status, 400, id);
    assert.equal((await response.json()).error.code, 'VALIDATION_ERROR');
  }
});

test('ban persists hidden and unban does not republish; explicit active-account review can publish', async () => {
  await db.exec("UPDATE users SET is_banned = true WHERE user_id = 'account-a'");
  assert.equal((await fetch(`${base}/9007199254740993`)).status, 404);
  assert.equal((await db.query("SELECT artist_visibility FROM artists WHERE artist_id = 9007199254740993")).rows[0].artist_visibility, 'hidden');
  await db.exec("UPDATE users SET is_banned = false WHERE user_id = 'account-a'");
  assert.equal((await fetch(`${base}/9007199254740993`)).status, 404);
  await db.exec("UPDATE artists SET artist_visibility = 'public' WHERE artist_id = 9007199254740993");
  assert.equal((await fetch(`${base}/9007199254740993`)).status, 200);
  await db.exec("UPDATE users SET is_banned = true WHERE user_id = 'account-b'");
  await assert.rejects(db.exec("UPDATE artists SET artist_visibility = 'public' WHERE artist_id = 5"), error => error.code === '23514');
});

test('view does not grant direct access to anon/authenticated and exposes no account columns', async () => {
  const acl = await db.query("SELECT has_table_privilege('anon', 'public.artist_profile_public', 'SELECT') AS anon, has_table_privilege('authenticated', 'public.artist_profile_public', 'SELECT') AS authenticated, has_table_privilege('service_role', 'public.artist_profile_public', 'SELECT') AS service");
  assert.deepEqual(acl.rows[0], { anon: false, authenticated: false, service: true });
  assert.deepEqual((await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'artist_profile_public' ORDER BY ordinal_position")).rows.map(row => row.column_name), ['id', 'name', 'image_url', 'biography']);
});

test('missing storage/configuration and source failures are retryable 500, never mock or empty success', async () => {
  for (const getClient of [async () => null, async () => { throw new Error('secret database diagnostic'); }]) {
    const repository = createArtistRepository({ getClient });
    await assert.rejects(repository.findPublicArtistById('1'));
  }
  const app = express();
  app.use('/artists', createArtistRouter({ findPublicArtistById: async () => { throw new Error('secret diagnostic'); } }));
  const listener = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  try {
    const response = await fetch(`http://127.0.0.1:${listener.address().port}/artists/1`);
    assert.equal(response.status, 500);
    const body = await response.json();
    assert.equal(body.error.code, 'INTERNAL_ERROR');
    assert.equal(JSON.stringify(body).includes('secret'), false);
  } finally { await new Promise(resolve => listener.close(resolve)); }
});
