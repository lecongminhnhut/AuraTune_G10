import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createHistoryRouter } from '../routes/historyRoutes.js';
import { HistoryStorageUnavailableError } from '../repositories/listeningHistoryRepository.js';
import { normalizeSong } from '../repositories/songRepository.js';

// Group 040 (041-FR-014): play-event API with an in-test repository double.
// Persistence against Supabase is verified end to end in docs/test/PA4_Section_E_evidence.md.

const songs = new Map([
  ['17', { song_id: '17', title: 'Glad To Be Stuck Inside', artist: 'HoliznaCC0', album: 'Lo-fi And Chill', duration: 161, is_active: true }],
  ['t8', { song_id: 't8', title: 'Midnight Coffee', artist: 'AuraTune Studio', album: 'Lofi bên cửa sổ', duration: 204, is_active: true }],
  ['gone', { song_id: 'gone', title: 'Removed', is_active: false }],
]);

function createFakeRepository() {
  let rows = [];
  let sequence = 0;
  return {
    failWith: null,
    get rows() { return rows; },
    reset() { rows = []; sequence = 0; this.failWith = null; },
    async insert({ userId, songId, listenedSeconds }) {
      if (this.failWith) throw this.failWith;
      const row = { id: `h${++sequence}`, user_id: userId, song_id: songId, listened_duration: listenedSeconds, played_at: new Date(Date.now() + sequence).toISOString() };
      rows.push(row);
      return row;
    },
    async raiseListened({ userId, id, listenedSeconds }) {
      const row = rows.find((item) => item.id === id && item.user_id === userId);
      if (!row) return null;
      row.listened_duration = Math.max(row.listened_duration, listenedSeconds);
      return row;
    },
    async listRecent(userId, limit) {
      if (this.failWith) throw this.failWith;
      return rows.filter((row) => row.user_id === userId).sort((a, b) => b.played_at.localeCompare(a.played_at)).slice(0, limit);
    },
    async clear(userId) {
      const before = rows.length;
      rows = rows.filter((row) => row.user_id !== userId);
      return before - rows.length;
    },
  };
}

const repository = createFakeRepository();
let server;
let baseUrl;

// Stand-in for authenticateToken: the user id comes from a test header.
const fakeAuth = (req, res, next) => {
  const userId = req.headers['x-test-user'];
  if (!userId) return res.status(401).json({ success: false, message: 'Authentication is required.' });
  req.user = { id: userId, user_id: userId };
  return next();
};

const call = (method, path = '', { user = 'u1', body } = {}) => fetch(`${baseUrl}${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', ...(user ? { 'x-test-user': user } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});

before(async () => {
  const app = express();
  app.use('/api/v1/users/me/history', createHistoryRouter({
    repository,
    authenticate: fakeAuth,
    findSong: async (id) => songs.get(id) ?? null,
    findSongs: async (ids) => new Map(ids.filter((id) => songs.has(id)).map((id) => [id, songs.get(id)])),
  }));
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/users/me/history`;
});

after(() => server?.close());
beforeEach(() => repository.reset());

describe('POST /api/v1/users/me/history', () => {
  test('requires authentication', async () => {
    const response = await call('POST', '', { user: null, body: { songId: '17' } });
    assert.equal(response.status, 401);
    assert.equal(repository.rows.length, 0);
  });

  test('stores a play event for the signed-in user and returns it with song metadata', async () => {
    const response = await call('POST', '', { body: { songId: '17', listenedSeconds: 30.4 } });
    assert.equal(response.status, 201);
    const { data } = await response.json();
    assert.equal(data.song_id, '17');
    assert.equal(data.listened_duration, 30);
    assert.equal(data.song.title, 'Glad To Be Stuck Inside');
    assert.deepEqual(repository.rows.map((row) => [row.user_id, row.song_id]), [['u1', '17']]);
  });

  test('rejects malformed song ids and listened values', async () => {
    for (const body of [{}, { songId: '../x' }, { songId: 'a'.repeat(65) }, { songId: 17 }]) {
      assert.equal((await call('POST', '', { body })).status, 400);
    }
    for (const listenedSeconds of [-1, 'abc', 90000, null]) {
      const response = await call('POST', '', { body: { songId: '17', listenedSeconds } });
      assert.equal(response.status, 400);
      assert.equal((await response.json()).error, 'invalid_listened_seconds');
    }
    assert.equal(repository.rows.length, 0);
  });

  test('returns 404 for unknown songs and 410 for unavailable ones', async () => {
    assert.equal((await call('POST', '', { body: { songId: 'nope' } })).status, 404);
    assert.equal((await call('POST', '', { body: { songId: 'gone' } })).status, 410);
    assert.equal(repository.rows.length, 0);
  });

  test('maps catalog key mismatches to 422 and storage outages to 503', async () => {
    repository.failWith = Object.assign(new Error('invalid input syntax for type bigint'), { code: '22P02' });
    let response = await call('POST', '', { body: { songId: 't8' } });
    assert.equal(response.status, 422);
    assert.equal((await response.json()).error, 'song_not_in_catalog');

    repository.failWith = new HistoryStorageUnavailableError();
    response = await call('POST', '', { body: { songId: '17' } });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'history_unavailable');
  });
});

describe('PATCH /api/v1/users/me/history/:entryId', () => {
  test('raises listened time but never lowers it', async () => {
    const { data } = await (await call('POST', '', { body: { songId: '17', listenedSeconds: 30 } })).json();
    let response = await call('PATCH', `/${data.id}`, { body: { listenedSeconds: 95 } });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data.listened_duration, 95);
    response = await call('PATCH', `/${data.id}`, { body: { listenedSeconds: 40 } });
    assert.equal((await response.json()).data.listened_duration, 95);
  });

  test("cannot touch another user's entry", async () => {
    const { data } = await (await call('POST', '', { body: { songId: '17', listenedSeconds: 30 } })).json();
    const response = await call('PATCH', `/${data.id}`, { user: 'u2', body: { listenedSeconds: 120 } });
    assert.equal(response.status, 404);
    assert.equal(repository.rows[0].listened_duration, 30);
  });

  test('requires a listened value', async () => {
    const { data } = await (await call('POST', '', { body: { songId: '17' } })).json();
    assert.equal((await call('PATCH', `/${data.id}`, { body: {} })).status, 400);
  });
});

describe('GET and DELETE /api/v1/users/me/history', () => {
  test('lists only the caller\'s entries, newest first, with metadata', async () => {
    await call('POST', '', { body: { songId: '17', listenedSeconds: 31 } });
    await call('POST', '', { body: { songId: 't8', listenedSeconds: 45 } });
    await call('POST', '', { user: 'u2', body: { songId: '17', listenedSeconds: 50 } });

    const response = await call('GET', '?limit=10');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    const { data } = await response.json();
    assert.deepEqual(data.map((entry) => entry.song_id), ['t8', '17']);
    assert.equal(data[0].song.title, 'Midnight Coffee');
  });

  test('validates limit', async () => {
    for (const limit of ['0', '201', 'abc', '-1']) {
      assert.equal((await call('GET', `?limit=${limit}`)).status, 400);
    }
  });

  test('clears only the caller\'s history', async () => {
    await call('POST', '', { body: { songId: '17', listenedSeconds: 31 } });
    await call('POST', '', { user: 'u2', body: { songId: '17', listenedSeconds: 31 } });
    const response = await call('DELETE');
    assert.deepEqual((await response.json()).data, { removed: 1 });
    assert.deepEqual(repository.rows.map((row) => row.user_id), ['u2']);
  });

  test('reports storage failures as 503 instead of an empty history', async () => {
    repository.failWith = Object.assign(new Error('connection reset'), { code: 'ECONNRESET' });
    const response = await call('GET');
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'history_storage_failed');
  });
});

describe('normalizeSong (real songs schema)', () => {
  test('reads album and artist from the embedded relations', () => {
    const song = normalizeSong({
      song_id: 17, title: 'Glad To Be Stuck Inside', album_id: 3, duration: 161, genre: null,
      audio_url: 'https://res.cloudinary.com/demo/video/upload/a.mp3', image_url: null,
      albums: { album_id: 3, title: 'Lo-fi And Chill', image_url: 'https://img/cover.jpg', artists: { artist_id: 5, name: 'HoliznaCC0' } },
    });
    assert.equal(song.song_id, '17');
    assert.equal(song.album, 'Lo-fi And Chill');
    assert.equal(song.album_id, '3');
    assert.equal(song.artist, 'HoliznaCC0');
    assert.equal(song.artist_id, '5');
    assert.equal(song.cover_url, 'https://img/cover.jpg');
    assert.equal(song.duration, 161);
    assert.equal(song.audio_url, 'https://res.cloudinary.com/demo/video/upload/a.mp3');
    assert.equal(song.is_active, true);
  });

  test('keeps working with flat legacy columns', () => {
    const song = normalizeSong({ id: 'x1', title: 'Flat', artist_name: 'A', album_title: 'B', duration_seconds: '3:05', file_url: 'x1.mp3', status: 'inactive' });
    assert.equal(song.artist, 'A');
    assert.equal(song.album, 'B');
    assert.equal(song.duration, 185);
    assert.equal(song.audio_url, 'x1.mp3');
    assert.equal(song.is_active, false);
  });
});
