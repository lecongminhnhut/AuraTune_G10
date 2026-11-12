import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import agentRoutes from '../../routes/agentRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';

let server;
let baseUrl;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/agent', agentRoutes);
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/agent`;
});

after(() => {
  server?.close();
});

describe('agentAuthIsolation (T031 - US4 Security & Isolation - FR-001, FR-010, SC-004)', () => {
  test('rejects unauthenticated requests without token with HTTP 401 UNAUTHORIZED envelope', async () => {
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Xin chào' })
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.message, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    assert.equal(body.data, null);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('rejects requests with forged/invalid token with HTTP 401 UNAUTHORIZED envelope', async () => {
    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid.forged.jwt.token'
      },
      body: JSON.stringify({ prompt: 'Xin chào' })
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.message, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('rejects requests with expired token with HTTP 401 UNAUTHORIZED envelope', async () => {
    const expiredToken = jwt.sign(
      { user_id: 'u-demo', email: 'demo@auratune.vn', role: 'listener' },
      JWT_SECRET,
      { expiresIn: '-10s' }
    );

    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${expiredToken}`
      },
      body: JSON.stringify({ prompt: 'Xin chào' })
    });

    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.message, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });
});
