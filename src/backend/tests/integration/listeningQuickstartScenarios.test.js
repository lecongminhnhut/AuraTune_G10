import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import statsRoutes from '../../routes/statsRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import * as historyRepo from '../../repositories/historyRepository.js';

let server;
let baseUrl;
let tokenUserDemo;
let tokenUserEmpty;
let tokenUserOther;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/users/me/stats', statsRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/users/me/stats`;

  tokenUserDemo = jwt.sign(
    { user_id: 'u-demo', email: 'demo@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  tokenUserEmpty = jwt.sign(
    { user_id: 'u-empty', email: 'empty@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  tokenUserOther = jwt.sign(
    { user_id: 'u-other', email: 'other@auratune.vn', role: 'listener' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
});

after(() => {
  server?.close();
});

describe('Quickstart Scenarios Validation (T029 - specs/100-ai-recommendations/101-listening-history-analysis/quickstart.md)', () => {
  test('Scenario 1: Review Personal Listening Insights (Happy Path - US1)', async () => {
    const now = Date.now();
    historyRepo.setInMemoryHistory([
      { id: 'h1', user_id: 'u-demo', song_id: 't1', listened_duration: 261, played_at: new Date(now - 1 * 86400000).toISOString() }, // ballad, 261s
      { id: 'h2', user_id: 'u-demo', song_id: 't8', listened_duration: 204, played_at: new Date(now - 2 * 86400000).toISOString() }, // lofi, 204s
      { id: 'h3', user_id: 'u-demo', song_id: 't9', listened_duration: 178, played_at: new Date(now - 3 * 86400000).toISOString() }, // lofi, 178s
    ]);

    const res = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: { Authorization: `Bearer ${tokenUserDemo}` },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.hasSufficientData, true);
    assert.equal(body.data.totalDurationSeconds, 643); // 261 + 204 + 178
    assert.equal(body.data.formattedTotalDuration, '11 phút');
    assert.equal(body.data.totalPlays, 3);
    assert.equal(body.data.uniqueTracksCount, 3);

    // Top genres ordered by accumulated duration: Lo-Fi (382s) > Ballad (261s)
    assert.equal(body.data.topGenres.length, 2);
    assert.equal(body.data.topGenres[0].genreId, 'lo-fi');
    assert.equal(body.data.topGenres[0].accumulatedSeconds, 382);
    assert.equal(body.data.topGenres[0].rank, 1);
    assert.equal(body.data.topGenres[1].genreId, 'ballad');
    assert.equal(body.data.topGenres[1].accumulatedSeconds, 261);
    assert.equal(body.data.topGenres[1].rank, 2);
  });

  test('Scenario 2: Insufficient History State (Empty State - US2)', async () => {
    historyRepo.clearInMemoryHistory('u-empty');

    const res = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: { Authorization: `Bearer ${tokenUserEmpty}` },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.message, 'Insufficient listening history for analysis');
    assert.equal(body.data.hasSufficientData, false);
    assert.equal(body.data.totalDurationSeconds, 0);
    assert.equal(body.data.formattedTotalDuration, '0 phút');
    assert.equal(body.data.totalPlays, 0);
    assert.deepEqual(body.data.topGenres, []);
  });

  test('Scenario 3: Account Isolation & Privacy (Security - US3)', async () => {
    // 1. Unauthenticated request receives 401
    const unauthRes = await fetch(`${baseUrl}/listening-analysis`);
    assert.equal(unauthRes.status, 401);
    const unauthBody = await unauthRes.json();
    assert.equal(unauthBody.success, false);
    assert.equal(unauthBody.error.code, 'UNAUTHORIZED');

    // 2. Data is strictly scoped to authenticated user
    const resDemo = await fetch(`${baseUrl}/listening-analysis`, {
      headers: { Authorization: `Bearer ${tokenUserDemo}` },
    });
    const bodyDemo = await resDemo.json();
    assert.equal(bodyDemo.data.userId, 'u-demo');

    // 3. Spoofed user_id parameter cannot leak other account data
    const spoofRes = await fetch(`${baseUrl}/listening-analysis?user_id=u-demo`, {
      headers: { Authorization: `Bearer ${tokenUserOther}` },
    });
    const spoofBody = await spoofRes.json();
    assert.equal(spoofBody.data.userId, 'u-other');
    assert.notEqual(spoofBody.data.userId, 'u-demo');
  });

  test('Scenario 4: Dynamic Refresh on New Playback Events (FR-013)', async () => {
    const beforeRes = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: { Authorization: `Bearer ${tokenUserDemo}` },
    });
    const beforeBody = await beforeRes.json();
    const durationBefore = beforeBody.data.totalDurationSeconds;

    // Simulate new playback event: u-demo plays song t10 (Slow Afternoon - chill) for 252 seconds
    historyRepo.addInMemoryHistory({
      id: `h-dyn-${Date.now()}`,
      user_id: 'u-demo',
      song_id: 't10',
      listened_duration: 252,
      played_at: new Date().toISOString(),
    });

    const afterRes = await fetch(`${baseUrl}/listening-analysis?range=all`, {
      headers: { Authorization: `Bearer ${tokenUserDemo}` },
    });
    const afterBody = await afterRes.json();

    // Duration must immediately and dynamically reflect the new event
    assert.equal(afterBody.data.totalDurationSeconds, durationBefore + 252);
    assert.equal(afterBody.data.totalPlays, beforeBody.data.totalPlays + 1);

    // New genre (Chill / Focus) must now appear in topGenres
    const hasChill = afterBody.data.topGenres.some((g) => g.genreId === 'chill');
    assert.equal(hasChill, true);
  });
});
