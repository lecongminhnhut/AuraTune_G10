import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import assistanceRoutes from '../../routes/assistanceRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';

let server;
let baseUrl;
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/agent/assistance', assistanceRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/agent/assistance`;

  const user = memDb.findUserById('u-demo') || {
    id: 'u-demo',
    email: 'demo@auratune.vn',
    role: 'listener',
  };
  const session = memDb.createSession({
    user_id: user.id,
    refresh_token_hash: 'mock-hash-assistance',
    device_info: 'test-assistance-agent',
    ip_address: '127.0.0.1',
  });

  validToken = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
      session_id: session.id,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
});

after(() => {
  server?.close();
});

describe('POST /api/v1/agent/assistance/execute (T011 - US1 Contract Tests)', () => {
  test('returns 401 UNAUTHORIZED when Authorization header is missing', async () => {
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intentType: 'play_music',
        extractedEntities: { controlAction: 'pause' },
      }),
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  });

  test('returns 400 VALIDATION_ERROR when intentType is missing', async () => {
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        extractedEntities: { controlAction: 'pause' },
      }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });

  test('returns 400 VALIDATION_ERROR when extractedEntities is missing', async () => {
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        intentType: 'play_music',
      }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });

  test('returns 200 with standard AssistancePlanEnvelope schema for playback control request', async () => {
    const start = Date.now();
    const res = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        intentType: 'play_music',
        extractedEntities: {
          songTitle: 'Nàng thơ',
          controlAction: null,
          volumeLevel: 50,
        },
        context: {
          currentTrack: null,
          isPlaying: false,
          volume: 50,
        },
      }),
    });
    const elapsed = Date.now() - start;

    assert.equal(res.status, 200);
    assert.ok(elapsed < 1000, `Execution latency ${elapsed}ms exceeded 1,000ms limit`);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.error, null);
    assert.ok(body.data.planId);
    assert.ok(Array.isArray(body.data.clientActions));
    assert.ok(body.data.clientActions.length > 0);
    assert.ok(body.data.confirmationText);
  });
});
