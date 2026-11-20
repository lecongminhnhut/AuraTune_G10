import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import recommendationRoutes from '../../routes/recommendationRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import * as signalRepo from '../../repositories/preferenceSignalRepository.js';
import * as catalogRepo from '../../repositories/catalogRepository.js';

let server;
let baseUrl;
let tokenUserEstablished;
let tokenUserColdStart;
let tokenUserPurged;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/recommendations', recommendationRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/recommendations`;

  tokenUserEstablished = jwt.sign(
    { user_id: 'u-established', email: 'established@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  tokenUserColdStart = jwt.sign(
    { user_id: 'u-cold-start', email: 'coldstart@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  tokenUserPurged = jwt.sign(
    { user_id: 'u-purged', email: 'purged@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  signalRepo.setUseInMemory(true);
  catalogRepo.setUseInMemory(true);

  // Established user signals
  signalRepo.setInMemorySignals('u-established', {
    history: [
      { song_id: 't1', listened_duration: 120 },
      { song_id: 't2', listened_duration: 180 },
      { song_id: 't3', listened_duration: 90 },
      { song_id: 't8', listened_duration: 200 },
    ],
    likes: ['t1'],
    follows: ['hoang-dung'],
  });

  // Cold start user signals
  signalRepo.clearInMemorySignals('u-cold-start');
});

after(() => {
  server?.close();
});

describe('Quickstart Scenarios Validation (T034 - specs/100-ai-recommendations/102-personalized-recommendations/quickstart.md)', () => {
  test('Scenario 1: Standard Personalized Recommendations Feed (User Story 1 - P1)', async () => {
    const res = await fetch(`${baseUrl}/personalized?limit=10`, {
      headers: {
        Authorization: `Bearer ${tokenUserEstablished}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(body.data.user_id, 'u-established');
    assert.ok(body.data.items.length > 0);

    // Verify deduplication (FR-015)
    const keys = body.data.items.map((i) => `${i.type}:${i.id}`);
    const uniqueKeys = new Set(keys);
    assert.equal(keys.length, uniqueKeys.size);

    // Verify 1-click interaction metadata
    body.data.items.forEach((item) => {
      assert.ok(item.title);
      assert.ok(item.subtitle !== undefined);
      assert.ok(item.badge);
      assert.ok(item.target_id);
      if (item.type === 'song') {
        assert.ok(item.extra.audio_url);
      }
    });
  });

  test('Scenario 2: Cold-Start Fallback for New or Low-Data Account (User Story 2 - P2)', async () => {
    const res = await fetch(`${baseUrl}/personalized`, {
      headers: {
        Authorization: `Bearer ${tokenUserColdStart}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.is_fallback, true);
    assert.equal(body.data.fallback_reason, 'COLD_START');
    assert.equal(body.data.user_id, 'u-cold-start');
    assert.ok(body.data.items.length > 0);

    // Verify badges (SC-002)
    body.data.items.forEach((item) => {
      if (item.type === 'song') {
        assert.equal(item.badge, 'Phổ biến');
      } else if (item.type === 'playlist') {
        assert.equal(item.badge, 'Thịnh hành');
      }
    });
  });

  test('Scenario 3: AI Service Downtime / Graceful Degradation (User Story 3 - P2 / EF-01)', async () => {
    // When external AI service is offline, backend must catch error and return HTTP 200
    const res = await fetch(`${baseUrl}/personalized?limit=5`, {
      headers: {
        Authorization: `Bearer ${tokenUserEstablished}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.is_fallback, true);
    assert.equal(body.data.fallback_reason, 'AI_SERVICE_UNAVAILABLE');
    assert.ok(body.message.includes('bảo trì'));
    assert.ok(body.data.items.length > 0);
  });

  test('Scenario 4: Account Privacy & Boundary Isolation (User Story 4 - P1)', async () => {
    // 1. Unauthenticated request
    const unauthRes = await fetch(`${baseUrl}/personalized`);
    assert.equal(unauthRes.status, 401);
    const unauthBody = await unauthRes.json();
    assert.equal(unauthBody.error.code, 'UNAUTHORIZED');

    // 2. Request with tokenUserColdStart attempting to query u-established data
    const authRes = await fetch(`${baseUrl}/personalized?user_id=u-established`, {
      headers: {
        Authorization: `Bearer ${tokenUserColdStart}`,
      },
    });
    assert.equal(authRes.status, 200);
    const authBody = await authRes.json();
    // Strictly scoped to caller identity (SC-001)
    assert.equal(authBody.data.user_id, 'u-cold-start');
    assert.equal(authBody.data.fallback_reason, 'COLD_START');
  });

  test('Scenario 5: Transition to Cold-Start Following History Purge (AF-03)', async () => {
    // 1. Populate initial history
    signalRepo.setInMemorySignals('u-purged', {
      history: [
        { song_id: 't1', listened_duration: 120 },
        { song_id: 't2', listened_duration: 180 },
        { song_id: 't3', listened_duration: 90 },
      ],
      likes: ['t1'],
      follows: ['hoang-dung'],
    });

    // 2. Simulate history purge
    signalRepo.clearInMemorySignals('u-purged');

    // 3. Request recommendations
    const res = await fetch(`${baseUrl}/personalized`, {
      headers: {
        Authorization: `Bearer ${tokenUserPurged}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.is_fallback, true);
    assert.equal(body.data.fallback_reason, 'COLD_START');
  });
});
