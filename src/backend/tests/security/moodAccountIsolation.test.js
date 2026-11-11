import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import moodRecommendationRoutes from '../../routes/moodRecommendationRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import * as moodCatalogRepo from '../../repositories/moodCatalogRepository.js';

let server;
let baseUrl;
let tokenUserA;
let tokenUserB;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/recommendations/mood-context', moodRecommendationRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/recommendations/mood-context`;

  tokenUserA = jwt.sign(
    { user_id: 'usr-alice-103', email: 'alice@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  tokenUserB = jwt.sign(
    { user_id: 'usr-bob-103', email: 'bob@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  moodCatalogRepo.setUseInMemory(true);
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('User Story 4 - Security & Account Isolation (Decree 13/2023/NĐ-CP)', () => {
  test('rejects unauthenticated request to /tags with HTTP 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}/tags`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
    assert.equal(body.message, 'Yêu cầu đăng nhập để nhận gợi ý theo tâm trạng');
  });

  test('rejects unauthenticated request to / with HTTP 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}?tag=chill`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
    assert.equal(body.message, 'Yêu cầu đăng nhập để nhận gợi ý theo tâm trạng');
  });

  test('rejects malformed token with HTTP 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}?tag=chill`, {
      headers: {
        Authorization: 'Bearer invalid.token.payload',
      },
    });
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('concurrent requests for User A and User B maintain strict session isolation with zero data leakage', async () => {
    const [resA, resB] = await Promise.all([
      fetch(`${baseUrl}?tag=chill`, {
        headers: { Authorization: `Bearer ${tokenUserA}` },
      }),
      fetch(`${baseUrl}?tag=focus`, {
        headers: { Authorization: `Bearer ${tokenUserB}` },
      }),
    ]);

    assert.equal(resA.status, 200);
    assert.equal(resB.status, 200);

    const bodyA = await resA.json();
    const bodyB = await resB.json();

    assert.equal(bodyA.data.tag, 'chill');
    assert.equal(bodyB.data.tag, 'focus');

    // Confirm no user IDs or PII leaked in response envelope
    const rawStringA = JSON.stringify(bodyA);
    const rawStringB = JSON.stringify(bodyB);
    assert.ok(!rawStringA.includes('usr-bob-103'));
    assert.ok(!rawStringB.includes('usr-alice-103'));
    assert.ok(!rawStringA.includes('bob@auratune.vn'));
    assert.ok(!rawStringB.includes('alice@auratune.vn'));
  });
});
