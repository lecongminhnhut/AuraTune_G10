import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createCommentRouter } from '../routes/commentRoutes.js';
import { canDeleteComment, normalizeCommentContent, toComment } from '../controllers/commentController.js';
import { CommentStorageUnavailableError, createCommentRepository } from '../repositories/commentRepository.js';

// Group 040, Feature 046: song comments API with an in-test repository double.
// Persistence against Supabase is checked with specs/040-music-player/quickstart.md rows 18–21 (T047).

const songs = new Map([
  ['17', { song_id: '17', title: 'Glad To Be Stuck Inside', is_active: true }],
  ['9', { song_id: '9', title: 'Removed', is_active: false }],
]);

const users = {
  u1: { user_id: 'u1', name: 'listener-one', display_name: 'Minh Anh', avatar_url: null },
  u2: { user_id: 'u2', name: 'listener-two', display_name: null, avatar_url: 'https://example.com/a.png' },
  admin: { user_id: 'admin', name: 'Admin', display_name: 'Quản trị viên', avatar_url: null },
};

function createFakeRepository() {
  let rows = [];
  let sequence = 0;
  return {
    failWith: null,
    get rows() { return rows; },
    reset() { rows = []; sequence = 0; this.failWith = null; },
    seed(songId, userId, content) {
      const row = { id: ++sequence, song_id: Number(songId), user_id: userId, content, created_at: new Date(Date.now() - 1000 * (100 - sequence)).toISOString(), author: users[userId] };
      rows.push(row);
      return row;
    },
    async listBySong(songId, limit) {
      if (this.failWith) throw this.failWith;
      const matching = rows.filter((row) => String(row.song_id) === String(songId)).sort((a, b) => b.id - a.id);
      return { rows: matching.slice(0, limit), hasMore: matching.length > limit };
    },
    async insert({ songId, userId, content }) {
      if (this.failWith) throw this.failWith;
      return this.seed(songId, userId, content);
    },
    async findById(commentId) {
      if (this.failWith) throw this.failWith;
      return rows.find((row) => String(row.id) === String(commentId)) ?? null;
    },
    async remove(commentId) {
      const before = rows.length;
      rows = rows.filter((row) => String(row.id) !== String(commentId));
      return rows.length < before;
    },
  };
}

const repository = createFakeRepository();
let server;
let baseUrl;

// Stand-in for authenticateToken: the user and role come from test headers.
const fakeAuth = (req, res, next) => {
  const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  if (!match || match[1] === 'invalid') return res.status(401).json({ success: false, message: 'Authentication is required.' });
  req.user = { id: match[1], user_id: match[1], role: match[1] === 'admin' ? 'admin' : 'user' };
  return next();
};

const call = (method, path, { user, body } = {}) => fetch(`${baseUrl}${path}`, {
  method,
  headers: { 'Content-Type': 'application/json', ...(user ? { Authorization: `Bearer ${user}` } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});

before(async () => {
  const app = express();
  app.use('/api/v1', createCommentRouter({
    repository,
    authenticate: fakeAuth,
    findSong: async (id) => songs.get(id) ?? null,
  }));
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(() => server?.close());
beforeEach(() => repository.reset());

describe('GET /api/v1/songs/:id/comments (FR-006, FR-007, FR-014)', () => {
  test('guests read comments newest first with author, time and text', async () => {
    repository.seed('17', 'u1', 'Nghe mỗi tối');
    repository.seed('17', 'u2', 'Hay quá');
    repository.seed('9', 'u1', 'Other song');
    const response = await call('GET', '/songs/17/comments');
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.success, true);
    assert.deepEqual(payload.data.map((comment) => comment.content), ['Hay quá', 'Nghe mỗi tối']);
    assert.deepEqual(payload.data[1].author, { id: 'u1', name: 'Minh Anh', avatar_url: null });
    assert.equal(payload.data[0].author.name, 'listener-two', 'falls back to the account name');
    assert.equal(payload.data.every((comment) => comment.can_delete === false), true, 'guests cannot delete');
    assert.match(payload.data[0].created_at, /^\d{4}-\d{2}-\d{2}T/);
    assert.deepEqual(payload.pagination, { limit: 50, has_more: false });
  });

  test('a song without comments returns an empty list', async () => {
    const payload = await (await call('GET', '/songs/17/comments')).json();
    assert.deepEqual(payload.data, []);
  });

  test('with a token, can_delete is true only for the author, and for administrators on every comment (FR-011)', async () => {
    repository.seed('17', 'u1', 'mine');
    repository.seed('17', 'u2', 'theirs');
    const own = await (await call('GET', '/songs/17/comments', { user: 'u1' })).json();
    assert.deepEqual(own.data.map((comment) => [comment.content, comment.can_delete]), [['theirs', false], ['mine', true]]);
    const admin = await (await call('GET', '/songs/17/comments', { user: 'admin' })).json();
    assert.equal(admin.data.every((comment) => comment.can_delete), true);
  });

  test('an invalid token is rejected instead of being treated as a guest', async () => {
    assert.equal((await call('GET', '/songs/17/comments', { user: 'invalid' })).status, 401);
  });

  test('limit and has_more', async () => {
    for (let index = 0; index < 3; index += 1) repository.seed('17', 'u1', `c${index}`);
    const payload = await (await call('GET', '/songs/17/comments?limit=2')).json();
    assert.deepEqual(payload.data.map((comment) => comment.content), ['c2', 'c1']);
    assert.deepEqual(payload.pagination, { limit: 2, has_more: true });
    assert.equal((await call('GET', '/songs/17/comments?limit=0')).status, 400);
    assert.equal((await call('GET', '/songs/17/comments?limit=101')).status, 400);
  });

  test('unknown songs, demo ids and storage errors', async () => {
    assert.equal((await call('GET', '/songs/404/comments')).status, 404);
    const demo = await call('GET', '/songs/t1/comments');
    assert.equal(demo.status, 400);
    assert.equal((await demo.json()).error, 'invalid_song_id');
    repository.failWith = new CommentStorageUnavailableError();
    const missing = await call('GET', '/songs/17/comments');
    assert.equal(missing.status, 503);
    assert.equal((await missing.json()).error, 'comments_unavailable');
    repository.failWith = new Error('network down');
    assert.equal((await call('GET', '/songs/17/comments')).status, 503);
  });
});

describe('POST /api/v1/songs/:id/comments (FR-008, FR-009)', () => {
  test('a signed-in user posts a trimmed comment', async () => {
    const response = await call('POST', '/songs/17/comments', { user: 'u1', body: { content: '  Giai điệu tuyệt vời 🎧  ' } });
    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.data.content, 'Giai điệu tuyệt vời 🎧');
    assert.equal(payload.data.author.id, 'u1');
    assert.equal(payload.data.can_delete, true);
    assert.equal(repository.rows.length, 1);
    assert.equal(repository.rows[0].user_id, 'u1');
  });

  test('guests cannot post', async () => {
    assert.equal((await call('POST', '/songs/17/comments', { body: { content: 'hello' } })).status, 401);
    assert.equal(repository.rows.length, 0);
  });

  test('empty, whitespace-only, non-string and over-long comments are rejected', async () => {
    for (const content of ['', '   \n\t ', 42, null, undefined, 'a'.repeat(301)]) {
      const response = await call('POST', '/songs/17/comments', { user: 'u1', body: { content } });
      assert.equal(response.status, 400, `content ${JSON.stringify(content)?.slice(0, 20)}`);
      assert.equal((await response.json()).error, 'invalid_comment');
    }
    assert.equal(repository.rows.length, 0);
  });

  test('300 characters is accepted, counting emoji as one character', async () => {
    assert.equal((await call('POST', '/songs/17/comments', { user: 'u1', body: { content: 'a'.repeat(300) } })).status, 201);
    assert.equal((await call('POST', '/songs/17/comments', { user: 'u1', body: { content: '🎧'.repeat(300) } })).status, 201);
  });

  test('unknown or unavailable songs, and storage errors', async () => {
    assert.equal((await call('POST', '/songs/404/comments', { user: 'u1', body: { content: 'hi' } })).status, 404);
    assert.equal((await call('POST', '/songs/9/comments', { user: 'u1', body: { content: 'hi' } })).status, 410);
    repository.failWith = Object.assign(new Error('fk'), { code: '23503' });
    assert.equal((await call('POST', '/songs/17/comments', { user: 'u1', body: { content: 'hi' } })).status, 404);
    repository.failWith = new CommentStorageUnavailableError();
    assert.equal((await call('POST', '/songs/17/comments', { user: 'u1', body: { content: 'hi' } })).status, 503);
  });
});

describe('DELETE /api/v1/comments/:id (FR-010, FR-012)', () => {
  test('the author deletes their comment', async () => {
    const row = repository.seed('17', 'u1', 'mine');
    const response = await call('DELETE', `/comments/${row.id}`, { user: 'u1' });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).data, { id: String(row.id) });
    assert.equal(repository.rows.length, 0);
  });

  test('another user cannot delete it, and an administrator can', async () => {
    const row = repository.seed('17', 'u1', 'mine');
    const forbidden = await call('DELETE', `/comments/${row.id}`, { user: 'u2' });
    assert.equal(forbidden.status, 403);
    assert.equal((await forbidden.json()).error, 'forbidden');
    assert.equal(repository.rows.length, 1);
    assert.equal((await call('DELETE', `/comments/${row.id}`, { user: 'admin' })).status, 200);
    assert.equal(repository.rows.length, 0);
  });

  test('guests, unknown ids and invalid ids', async () => {
    const row = repository.seed('17', 'u1', 'mine');
    assert.equal((await call('DELETE', `/comments/${row.id}`)).status, 401);
    assert.equal((await call('DELETE', '/comments/999', { user: 'u1' })).status, 404);
    assert.equal((await call('DELETE', '/comments/abc', { user: 'u1' })).status, 400);
    assert.equal(repository.rows.length, 1);
  });
});

describe('comment helpers', () => {
  test('normalizeCommentContent', () => {
    assert.equal(normalizeCommentContent(' hi '), 'hi');
    assert.equal(normalizeCommentContent('a\u0000b'), 'ab');
    assert.equal(normalizeCommentContent('\u0007'), null);
    assert.equal(normalizeCommentContent('x'.repeat(300)), 'x'.repeat(300));
    assert.equal(normalizeCommentContent('x'.repeat(301)), null);
  });

  test('canDeleteComment and toComment', () => {
    const row = { id: 5, song_id: 17, user_id: 'u1', content: 'x', created_at: '2026-11-25T01:00:00Z', author: [users.u1] };
    assert.equal(canDeleteComment(null, row), false);
    assert.equal(canDeleteComment({ id: 'u1', role: 'user' }, row), true);
    assert.equal(canDeleteComment({ id: 'u2', role: 'user' }, row), false);
    assert.equal(canDeleteComment({ id: 'u2', role: 'admin' }, row), true);
    const comment = toComment(row);
    assert.equal(comment.id, '5');
    assert.equal(comment.song_id, '17');
    assert.equal(comment.author.name, 'Minh Anh', 'reads an embedded relation returned as an array');
    assert.equal(toComment({ ...row, author: null }).author.name, 'Người nghe AuraTune');
  });
});

describe('createCommentRepository (Supabase query shape)', () => {
  function fakeClient(result) {
    const calls = [];
    const builder = new Proxy({}, {
      get(_target, method) {
        if (method === 'then') return (resolve) => resolve(result);
        return (...args) => { calls.push([method, ...args]); return builder; };
      },
    });
    return { calls, from: (table) => { calls.push(['from', table]); return builder; } };
  }

  test('lists newest first from song_comments with the author embedded', async () => {
    const client = fakeClient({ data: [{ id: 3 }, { id: 2 }, { id: 1 }], error: null });
    const result = await createCommentRepository(client).listBySong('17', 2);
    assert.deepEqual(result, { rows: [{ id: 3 }, { id: 2 }], hasMore: true });
    assert.deepEqual(client.calls[0], ['from', 'song_comments']);
    assert.match(client.calls[1][1], /author:users\(/);
    assert.deepEqual(client.calls.slice(2), [['eq', 'song_id', '17'], ['order', 'comment_id', { ascending: false }], ['limit', 3]]);
  });

  test('a missing table becomes CommentStorageUnavailableError; other errors pass through', async () => {
    await assert.rejects(createCommentRepository(fakeClient({ data: null, error: { code: 'PGRST205' } })).listBySong('17', 5), CommentStorageUnavailableError);
    await assert.rejects(createCommentRepository(fakeClient({ data: null, error: { code: '42P01' } })).findById('1'), CommentStorageUnavailableError);
    await assert.rejects(createCommentRepository(fakeClient({ data: null, error: { code: '08006', message: 'down' } })).insert({ songId: '17', userId: 'u1', content: 'x' }), (error) => error.code === '08006');
    await assert.rejects(createCommentRepository(null).listBySong('17', 5), CommentStorageUnavailableError);
  });

  test('remove reports whether a row was deleted', async () => {
    assert.equal(await createCommentRepository(fakeClient({ data: [{ comment_id: 1 }], error: null })).remove('1'), true);
    assert.equal(await createCommentRepository(fakeClient({ data: [], error: null })).remove('1'), false);
  });
});
