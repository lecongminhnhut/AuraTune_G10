import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import moodRecommendationRoutes from '../../routes/moodRecommendationRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';
import * as moodCatalogRepo from '../../repositories/moodCatalogRepository.js';

let server;
let baseUrl;
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/recommendations/mood-context', moodRecommendationRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/recommendations/mood-context`;

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

  moodCatalogRepo.setUseInMemory(true);
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('Mood & Context Recommendations API Contract Tests (Feature 103)', () => {
  test('GET /tags returns 200 with 8 preset tags conforming to schema', async () => {
    const res = await fetch(`${baseUrl}/tags`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();

    assert.equal(body.success, true);
    assert.ok(body.data?.tags);
    assert.equal(body.data.tags.length, 8);

    for (const tag of body.data.tags) {
      assert.ok(tag.id, 'Tag must have id');
      assert.ok(tag.label, 'Tag must have label');
      assert.ok(['mood', 'context'].includes(tag.category), 'Category must be mood or context');
      assert.ok(tag.icon, 'Tag must have icon');
      assert.ok(tag.color_gradient, 'Tag must have color_gradient');
    }
  });

  test('GET / with valid tag returns 200 with polymorphic items (songs and playlists only)', async () => {
    const res = await fetch(`${baseUrl}?tag=chill&limit=10`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();

    assert.equal(body.success, true);
    assert.equal(body.data.tag, 'chill');
    assert.equal(body.data.tag_category, 'mood');
    assert.ok(typeof body.data.is_service_degraded === 'boolean');
    assert.ok(Array.isArray(body.data.items));
    assert.ok(body.data.items.length > 0);

    for (const item of body.data.items) {
      assert.ok(['song', 'playlist'].includes(item.type), 'Item must be song or playlist only');
      assert.ok(item.id);
      assert.ok(item.title);
      assert.ok(item.target_id);
      assert.ok(item.badge);
      assert.ok(typeof item.extra === 'object');
      if (item.type === 'song') {
        assert.ok(typeof item.extra.duration === 'number');
        assert.ok(typeof item.extra.audio_url === 'string');
      } else if (item.type === 'playlist') {
        assert.ok(typeof item.extra.track_count === 'number');
        assert.ok(typeof item.extra.is_official === 'boolean');
      }
    }
  });

  test('GET / without authorization token returns 401 UNAUTHORIZED', async () => {
    const res = await fetch(`${baseUrl}?tag=chill`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'UNAUTHORIZED');
  });

  test('GET / with invalid tag returns 400 INVALID_MOOD_TAG', async () => {
    const res = await fetch(`${baseUrl}?tag=super_sad`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error?.code, 'INVALID_MOOD_TAG');
    assert.ok(Array.isArray(body.error?.details));
  });
});
