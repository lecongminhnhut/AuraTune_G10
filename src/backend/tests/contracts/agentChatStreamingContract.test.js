import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import agentRoutes from '../../routes/agentRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db } from '../../repositories/authRepository.js';

let server;
let baseUrl;
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/agent', agentRoutes);
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/agent`;

  // Create an active session for u-demo in memDb
  const { db: memDb } = await import('../../db.js');
  const user = memDb.findUserById('u-demo') || {
    id: 'u-demo',
    email: 'demo@auratune.vn',
    role: 'listener'
  };
  const session = memDb.createSession({
    user_id: user.id,
    refresh_token_hash: 'mock-hash',
    device_info: 'test-agent',
    ip_address: '127.0.0.1'
  });

  validToken = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
      session_id: session.id
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
});

after(() => {
  server?.close();
});

describe('POST /api/v1/agent/chat (T016 - US2 Streaming Contract)', () => {
  test('returns 401 UNAUTHORIZED when Authorization header is missing', async () => {
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Hello' })
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('returns 400 VALIDATION_ERROR when prompt is empty or missing', async () => {
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
        'User-Agent': 'test-agent'
      },
      body: JSON.stringify({ prompt: '   ' })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'VALIDATION_ERROR');
    assert.ok(body.error?.details?.length > 0);
  });

  test('opens valid text/event-stream and yields thinking, text, and done events', async () => {
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
        'User-Agent': 'test-agent'
      },
      body: JSON.stringify({
        prompt: 'Xin chào',
        context: {
          currentTrack: { id: 't1', title: 'Demo Song', artist: 'Artist' },
          isPlaying: true,
          volume: 80
        }
      })
    });

    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /text\/event-stream/);

    const text = await res.text();
    assert.ok(text.includes('event: thinking'), 'Should include thinking event');
    assert.ok(text.includes('event: text'), 'Should include text event');
    assert.ok(text.includes('event: done'), 'Should include done event');
  });
});
