import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import agentRoutes from '../../routes/agentRoutes.js';

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

describe('GET /api/v1/agent/health (T010 - US1 Contract)', () => {
  test('returns HTTP 200 with online status and latencyMs conforming to OpenAPI contract', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /application\/json/);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(typeof body.message, 'string');
    assert.equal(body.error, null);
    assert.ok(body.data, 'Expected data object');
    assert.equal(body.data.status, 'online');
    assert.equal(typeof body.data.latencyMs, 'number');
    assert.ok(body.data.latencyMs >= 0);
  });
});
