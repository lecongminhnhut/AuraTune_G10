import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import statsRoutes from '../../routes/statsRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';
import * as historyRepo from '../../repositories/historyRepository.js';

let server;
let baseUrl;
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/users/me/stats', statsRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/users/me/stats`;

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
});

after(() => {
  server?.close();
});

describe('GET /api/v1/users/me/stats/listening-analysis (T010 - US1 Contract)', () => {
  test('returns HTTP 200 conforming strictly to ListeningAnalysisApiResponse schema', async () => {
    // Seed at least one valid history entry for u-demo
    historyRepo.setInMemoryHistory([
      {
        id: 'h-seed-contract-1',
        user_id: 'u-demo',
        song_id: 't1',
        listened_duration: 261,
        played_at: new Date().toISOString(),
      },
    ]);

    const res = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /application\/json/);

    const body = await res.json();

    // Verify Envelope
    assert.equal(body.success, true);
    assert.equal(typeof body.message, 'string');
    assert.equal(body.error, null);
    assert.ok(body.data, 'Expected data object');

    // Verify Data payload fields
    const data = body.data;
    assert.equal(typeof data.userId, 'string');
    assert.equal(data.range, 'all');
    assert.equal(typeof data.hasSufficientData, 'boolean');
    assert.equal(data.hasSufficientData, true);
    assert.equal(typeof data.totalDurationSeconds, 'number');
    assert.ok(data.totalDurationSeconds >= 0);
    assert.equal(typeof data.formattedTotalDuration, 'string');
    assert.equal(typeof data.totalPlays, 'number');
    assert.ok(data.totalPlays >= 1);
    assert.equal(typeof data.uniqueTracksCount, 'number');
    assert.ok(data.uniqueTracksCount >= 1);
    assert.ok(Array.isArray(data.topGenres));
    assert.ok(!Number.isNaN(Date.parse(data.calculatedAt)), 'calculatedAt must be valid ISO date-time');

    // Verify Genre item schema
    if (data.topGenres.length > 0) {
      const top = data.topGenres[0];
      assert.equal(typeof top.rank, 'number');
      assert.equal(top.rank, 1);
      assert.equal(typeof top.genreId, 'string');
      assert.equal(typeof top.genreName, 'string');
      assert.equal(typeof top.accumulatedSeconds, 'number');
      assert.ok(top.accumulatedSeconds >= 0);
      assert.equal(typeof top.formattedDuration, 'string');
      assert.equal(typeof top.percentage, 'number');
      assert.ok(top.percentage >= 0.0 && top.percentage <= 100.0);
    }
  });
});
