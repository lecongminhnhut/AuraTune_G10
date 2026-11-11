import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import intentRoutes from '../../routes/intentRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';

let server;
let baseUrl;
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/agent/intent', intentRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/agent/intent`;

  const user = memDb.findUserById('u-demo') || {
    id: 'u-demo',
    email: 'demo@auratune.vn',
    role: 'listener',
  };
  const session = memDb.createSession({
    user_id: user.id,
    refresh_token_hash: 'mock-hash',
    device_info: 'test-intent-agent',
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

describe('POST /api/v1/agent/intent/analyze (T011 - US1 Contract Tests)', () => {
  test('returns 401 UNAUTHORIZED when Authorization header is missing', async () => {
    const res = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawPrompt: 'bật nhạc' }),
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('returns 400 VALIDATION_ERROR when rawPrompt is empty or missing', async () => {
    const res = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({ rawPrompt: '   ' }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'VALIDATION_ERROR');
    assert.ok(Array.isArray(body.error?.details));
    assert.equal(body.error.details[0]?.field, 'rawPrompt');
  });

  test('returns 400 VALIDATION_ERROR when rawPrompt exceeds 500 characters', async () => {
    const longPrompt = 'a'.repeat(501);
    const res = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({ rawPrompt: longPrompt }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'VALIDATION_ERROR');
  });

  test('returns 200 with standard MusicIntentResult envelope for playback prompt', async () => {
    const res = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        rawPrompt: 'bật bài Chúng ta của hiện tại của Sơn Tùng M-TP',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.error, null);
    assert.ok(body.data);
    assert.ok(body.data.requestId.startsWith('req-intent-'));
    assert.equal(body.data.intentType, 'play_music');
    assert.ok(body.data.confidenceScore >= 0.9);
    assert.equal(body.data.completenessStatus, 'complete');
    assert.equal(body.data.extractedEntities?.songTitle, 'Chúng ta của hiện tại');
    assert.equal(body.data.extractedEntities?.artistName, 'Sơn Tùng M-TP');
    assert.equal(body.data.suggestedAction, 'real_time_assistance');
    assert.ok(Array.isArray(body.data.clauses));
    assert.equal(body.data.sanitizedPrompt, 'bật bài Chúng ta của hiện tại của Sơn Tùng M-TP');
  });
});
