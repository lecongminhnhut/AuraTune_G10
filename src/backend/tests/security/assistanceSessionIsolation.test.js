import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import assistanceRoutes from '../../routes/assistanceRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';

let server;
let baseUrl;
let tokenUserA;
let tokenUserB;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/agent/assistance', assistanceRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/agent/assistance`;

  const userA = memDb.findUserById('u-user-A') || {
    id: 'u-user-A',
    email: 'userA@auratune.vn',
    role: 'listener',
  };
  const sessionA = memDb.createSession({
    user_id: userA.id,
    refresh_token_hash: 'mock-hash-A',
    device_info: 'device-user-A',
    ip_address: '127.0.0.1',
  });
  tokenUserA = jwt.sign(
    {
      user_id: userA.id,
      email: userA.email,
      role: userA.role,
      session_id: sessionA.id,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const userB = memDb.findUserById('u-user-B') || {
    id: 'u-user-B',
    email: 'userB@auratune.vn',
    role: 'listener',
  };
  const sessionB = memDb.createSession({
    user_id: userB.id,
    refresh_token_hash: 'mock-hash-B',
    device_info: 'device-user-B',
    ip_address: '127.0.0.1',
  });
  tokenUserB = jwt.sign(
    {
      user_id: userB.id,
      email: userB.email,
      role: userB.role,
      session_id: sessionB.id,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
});

after(() => {
  server?.close();
});

describe('assistanceSessionIsolation (T034 - US5 Session Authorization & Isolation - SC-002)', () => {
  test('rejects cross-account private playlist mutation with HTTP 403 FORBIDDEN', async () => {
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUserA}`,
      },
      body: JSON.stringify({
        intentType: 'manage_library',
        extractedEntities: {
          controlAction: 'save_to_playlist',
          targetOwnerId: 'u-user-B',
          isCollaborative: false,
          targetTrackId: 't1',
        },
      }),
    });

    assert.equal(res.status, 403);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'FORBIDDEN');
  });

  test('allows mutation when targetOwnerId matches authenticated user', async () => {
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUserA}`,
      },
      body: JSON.stringify({
        intentType: 'manage_library',
        extractedEntities: {
          controlAction: 'save_to_playlist',
          targetOwnerId: 'u-user-A',
          isCollaborative: false,
          targetTrackId: 't1',
        },
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
  });

  test('rejects unauthenticated request with 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intentType: 'manage_library',
        extractedEntities: { controlAction: 'like_track' },
      }),
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });
});
