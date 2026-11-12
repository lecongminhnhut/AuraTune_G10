import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import recommendationRoutes from '../../routes/recommendationRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';
import * as signalRepo from '../../repositories/preferenceSignalRepository.js';
import * as catalogRepo from '../../repositories/catalogRepository.js';

let server;
let baseUrl;
let tokenUserA;
let tokenUserB;
let tokenBanned;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/recommendations', recommendationRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/recommendations`;

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

  // Register banned user in memory
  memDb.users.push({
    id: 'user-banned',
    email: 'banned@auratune.vn',
    role: 'listener',
    is_banned: true,
  });

  tokenBanned = jwt.sign(
    { user_id: 'user-banned', email: 'banned@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  signalRepo.setUseInMemory(true);
  catalogRepo.setUseInMemory(true);

  // User A signals
  signalRepo.setInMemorySignals('user-a', {
    history: [{ song_id: 't1', listened_duration: 120 }],
    likes: ['t1'],
    follows: ['hoang-dung'],
  });

  // User B signals (Cold start)
  signalRepo.setInMemorySignals('user-b', {
    history: [],
    likes: [],
    follows: [],
  });
});

after(() => {
  server?.close();
  // Cleanup banned user
  const idx = memDb.users.findIndex((u) => u.id === 'user-banned');
  if (idx !== -1) memDb.users.splice(idx, 1);
});

describe('Recommendation Security & Account Privacy (T028 - US4 / Decree 13/2023/NĐ-CP)', () => {
  test('unauthenticated request without Bearer token returns HTTP 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}/personalized`);
    assert.equal(res.status, 401);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
    assert.equal(body.message, 'Yêu cầu đăng nhập để nhận gợi ý cá nhân hóa');
  });

  test('request with invalid Bearer token returns HTTP 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}/personalized`, {
      headers: {
        Authorization: 'Bearer invalid.tampered.token',
      },
    });
    assert.equal(res.status, 401);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });

  test('banned user returns HTTP 403 ACCOUNT_BANNED', async () => {
    const res = await fetch(`${baseUrl}/personalized`, {
      headers: {
        Authorization: `Bearer ${tokenBanned}`,
      },
    });
    assert.equal(res.status, 403);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'ACCOUNT_BANNED');
    assert.equal(body.message, 'Tài khoản của bạn đã bị khóa');
  });

  test('strictly enforces account isolation: query params cannot spoof another user identity', async () => {
    // User A attempts to request User B's recommendations by injecting ?user_id=user-b
    const res = await fetch(`${baseUrl}/personalized?user_id=user-b`, {
      headers: {
        Authorization: `Bearer ${tokenUserA}`,
      },
    });
    assert.equal(res.status, 200);

    const body = await res.json();
    // Returned user_id must be strictly User A (from JWT), never spoofed User B
    assert.equal(body.data.user_id, 'user-a');
  });
});
