import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import statsRoutes from '../../routes/statsRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import * as historyRepo from '../../repositories/historyRepository.js';

let server;
let baseUrl;
let tokenUserA;
let tokenUserB;
let expiredToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/users/me/stats', statsRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/users/me/stats`;

  tokenUserA = jwt.sign(
    { user_id: 'user-a', email: 'usera@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  tokenUserB = jwt.sign(
    { user_id: 'user-b', email: 'userb@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  expiredToken = jwt.sign(
    { user_id: 'user-a', email: 'usera@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '-1s' }
  );
});

after(() => {
  server?.close();
});

describe('Privacy and Account Data Isolation (T023 - US3)', () => {
  test('returns HTTP 401 UNAUTHORIZED when Authorization header is missing', async () => {
    const res = await fetch(`${baseUrl}/listening-analysis`);
    assert.equal(res.status, 401);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.message, 'Yêu cầu đăng nhập để truy cập thông tin phân tích');
    assert.equal(body.data, null);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('returns HTTP 401 UNAUTHORIZED when Bearer token is expired', async () => {
    const res = await fetch(`${baseUrl}/listening-analysis`, {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    });
    assert.equal(res.status, 401);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.message, 'Yêu cầu đăng nhập để truy cập thông tin phân tích');
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('User A aggregation strictly excludes listening events belonging to User B (FR-005, FR-006)', async () => {
    const now = new Date().toISOString();
    // User A has 1 play of 120 seconds
    // User B has 1 play of 500 seconds
    historyRepo.setInMemoryHistory([
      { id: '1', user_id: 'user-a', song_id: 't1', listened_duration: 120, played_at: now },
      { id: '2', user_id: 'user-b', song_id: 't2', listened_duration: 500, played_at: now },
    ]);

    // Request as User A
    const resA = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: {
        Authorization: `Bearer ${tokenUserA}`,
      },
    });
    assert.equal(resA.status, 200);
    const bodyA = await resA.json();
    assert.equal(bodyA.data.userId, 'user-a');
    assert.equal(bodyA.data.totalDurationSeconds, 120);
    assert.equal(bodyA.data.totalPlays, 1);

    // Request as User B
    const resB = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: {
        Authorization: `Bearer ${tokenUserB}`,
      },
    });
    assert.equal(resB.status, 200);
    const bodyB = await resB.json();
    assert.equal(bodyB.data.userId, 'user-b');
    assert.equal(bodyB.data.totalDurationSeconds, 500);
    assert.equal(bodyB.data.totalPlays, 1);
  });

  test('Prohibits client-supplied userId in query parameter from overriding authenticated token (FR-006)', async () => {
    // Attempt privilege escalation by passing ?userId=user-b while authenticated as user-a
    const res = await fetch(`${baseUrl}/listening-analysis?userId=user-b&user_id=user-b`, {
      headers: {
        Authorization: `Bearer ${tokenUserA}`,
      },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    // Must strictly return User A's data, ignoring the spoofed query parameter
    assert.equal(body.data.userId, 'user-a');
    assert.equal(body.data.totalDurationSeconds, 120);
  });
});
