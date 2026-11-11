import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import moodRecommendationRoutes from '../../routes/moodRecommendationRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import * as moodCatalogRepo from '../../repositories/moodCatalogRepository.js';

let server;
let baseUrl;
let token;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/recommendations/mood-context', moodRecommendationRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/recommendations/mood-context`;

  token = jwt.sign(
    { user_id: 'listener1', email: 'listener1@auratune.vn', role: 'listener' },
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

describe('Feature 103 Quickstart & Validation Scenarios (quickstart.md)', () => {
  // Scenario 1: Standard Mood Recommendation Stream (US1 - P1)
  test('Scenario 1: Standard Mood Recommendation Stream for "chill"', async () => {
    // Step 2: Retrieve preset tags
    const tagsRes = await fetch(`${baseUrl}/tags`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(tagsRes.status, 200);
    const tagsBody = await tagsRes.json();
    assert.equal(tagsBody.success, true);
    assert.equal(tagsBody.data.tags.length, 8);

    // Step 3: Request recommendations for "chill"
    const recRes = await fetch(`${baseUrl}?tag=chill`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(recRes.status, 200);
    const recBody = await recRes.json();
    assert.equal(recBody.success, true);
    assert.equal(recBody.data.tag, 'chill');
    assert.ok(recBody.data.total_items > 0);

    // Verify entities are strictly individual songs and playlists (no albums, no artists)
    const entityTypes = recBody.data.items.map((item) => item.type);
    assert.ok(entityTypes.every((t) => t === 'song' || t === 'playlist'));

    // Zero duplicate items
    const ids = recBody.data.items.map((item) => `${item.type}:${item.id}`);
    assert.equal(ids.length, new Set(ids).size);
  });

  // Scenario 2: Empty Matches with Alternative Suggestions (US2 - P2 / AF-02)
  test('Scenario 2: Empty Matches with Alternative Suggestions', async () => {
    // When tag has no matching songs/playlists, returns total_items: 0 and alternative_suggestions
    // Note: melancholy in catalog fixtures has songs, but when querying type="playlist" for melancholy:
    const res = await fetch(`${baseUrl}?tag=melancholy&type=playlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.tag, 'melancholy');
    assert.equal(body.data.total_items, 0);
    assert.deepEqual(body.data.items, []);
    assert.ok(Array.isArray(body.data.alternative_suggestions));
    assert.ok(body.data.alternative_suggestions.length >= 2);
  });

  // Scenario 3: AI Service Downtime & Graceful Degradation (US3 - P2 / EF-01)
  test('Scenario 3: AI Service Downtime degrades gracefully with HTTP 200', async () => {
    const start = Date.now();
    const res = await fetch(`${baseUrl}?tag=workout`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const elapsed = Date.now() - start;

    assert.equal(res.status, 200, 'Must NOT return 500 or 503');
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.is_service_degraded, true);
    assert.ok(body.data.items.length > 0, 'Must contain fallback items');
    assert.ok(body.data.fallback_shortcuts.length > 0, 'Must provide navigation shortcuts');
    assert.ok(elapsed < 2600, `Must respond within 2.6s, elapsed: ${elapsed}ms`);
  });

  // Scenario 4: Account Privacy & Boundary Isolation (US4 - P1)
  test('Scenario 4: Privacy & Boundary Isolation', async () => {
    // 1. Attempt unauthenticated access -> 401
    const unauthRes = await fetch(`${baseUrl}?tag=chill`);
    assert.equal(unauthRes.status, 401);
    const unauthBody = await unauthRes.json();
    assert.equal(unauthBody.error?.code, 'UNAUTHORIZED');

    // 2. Attempt request with invalid tag -> 400
    const invalidTagRes = await fetch(`${baseUrl}?tag=super_sad`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(invalidTagRes.status, 400);
    const invalidTagBody = await invalidTagRes.json();
    assert.equal(invalidTagBody.error?.code, 'INVALID_MOOD_TAG');
  });
});
