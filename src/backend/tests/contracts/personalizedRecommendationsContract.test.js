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
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/recommendations', recommendationRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/recommendations`;

  const user = memDb.findUserById('u-demo') || {
    id: 'u-demo',
    email: 'demo@auratune.vn',
    role: 'listener',
  };

  validToken = jwt.sign(
    {
      user_id: user.id || 'u-demo',
      email: user.email,
      role: user.role || 'listener',
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  signalRepo.setUseInMemory(true);
  catalogRepo.setUseInMemory(true);
  signalRepo.setInMemorySignals('u-demo', {
    history: [
      { song_id: 't1', listened_duration: 120 },
      { song_id: 't2', listened_duration: 200 },
      { song_id: 't3', listened_duration: 95 },
    ],
    likes: ['t1'],
    follows: ['hoang-dung'],
  });
});

after(() => {
  server?.close();
});

describe('Personalized Recommendations API Contract Tests (T011 - US1)', () => {
  test('GET /recommendations/personalized conforms to RecommendationApiResponse schema', async () => {
    const res = await fetch(`${baseUrl}/personalized?limit=5`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();

    assert.equal(body.success, true);
    assert.equal(typeof body.message, 'string');
    assert.equal(body.error, null);
    assert.ok(body.data);

    const { data } = body;
    assert.equal(typeof data.user_id, 'string');
    assert.equal(typeof data.is_fallback, 'boolean');
    assert.equal(typeof data.total_items, 'number');
    assert.ok(Array.isArray(data.items));
    assert.equal(data.total_items, data.items.length);
    assert.ok(!isNaN(Date.parse(data.generated_at)));

    if (data.items.length > 0) {
      const item = data.items[0];
      assert.ok(item.id);
      assert.ok(['song', 'album', 'artist', 'playlist'].includes(item.type));
      assert.ok(typeof item.title === 'string');
      assert.ok(typeof item.subtitle === 'string');
      assert.ok(typeof item.badge === 'string');
      assert.ok(item.target_id);
      assert.ok(typeof item.extra === 'object');
    }
  });

  test('GET /recommendations/songs alias returns only song items', async () => {
    const res = await fetch(`${baseUrl}/songs?limit=4`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();

    assert.equal(body.success, true);
    assert.ok(body.data.items.length > 0);
    body.data.items.forEach((item) => {
      assert.equal(item.type, 'song');
      assert.ok(item.extra.duration > 0);
      assert.ok(item.extra.audio_url);
    });
  });

  test('returns 400 VALIDATION_ERROR on invalid type parameter', async () => {
    const res = await fetch(`${baseUrl}/personalized?type=invalid_type`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });

  test('returns 400 VALIDATION_ERROR on invalid limit parameter (limit > 50)', async () => {
    const res = await fetch(`${baseUrl}/personalized?limit=99`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
  });
});
