import { describe, test, beforeEach, after, before } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import statsRoutes from '../../routes/statsRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { calculateListeningAnalysis } from '../../services/listeningAnalysisService.js';
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

  validToken = jwt.sign(
    {
      user_id: 'user-empty',
      email: 'empty@auratune.vn',
      role: 'listener',
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
});

after(() => {
  server?.close();
});

describe('Insufficient & Unavailable Data (T018 - US2)', () => {
  beforeEach(() => {
    historyRepo.setSimulateDbError(false);
  });

  test('returns hasSufficientData: false, topGenres: [], and totalDurationSeconds: 0 when account has 0 records', async () => {
    historyRepo.setInMemoryHistory([]);

    const result = await calculateListeningAnalysis('user-empty', 'all');

    assert.equal(result.hasSufficientData, false);
    assert.equal(result.totalDurationSeconds, 0);
    assert.equal(result.formattedTotalDuration, '0 phút');
    assert.equal(result.totalPlays, 0);
    assert.equal(result.uniqueTracksCount, 0);
    assert.deepEqual(result.topGenres, []);
  });

  test('filters out invalid records (listened_duration <= 0, song_id = null) and returns insufficientData if 0 eligible', async () => {
    const invalidRecords = [
      { id: 'inv-1', user_id: 'user-empty', song_id: null, listened_duration: 120, played_at: new Date().toISOString() },
      { id: 'inv-2', user_id: 'user-empty', song_id: 't1', listened_duration: 0, played_at: new Date().toISOString() },
      { id: 'inv-3', user_id: 'user-empty', song_id: 't2', listened_duration: -50, played_at: new Date().toISOString() },
    ];

    historyRepo.setInMemoryHistory(invalidRecords);

    const result = await calculateListeningAnalysis('user-empty', 'all');

    assert.equal(result.hasSufficientData, false);
    assert.equal(result.totalDurationSeconds, 0);
    assert.deepEqual(result.topGenres, []);
  });

  test('API returns HTTP 200 with insufficient history envelope when user has no plays', async () => {
    historyRepo.setInMemoryHistory([]);

    const res = await fetch(`${baseUrl}/listening-analysis`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.message, 'Insufficient listening history for analysis');
    assert.equal(body.data.hasSufficientData, false);
    assert.equal(body.data.totalDurationSeconds, 0);
    assert.deepEqual(body.data.topGenres, []);
  });

  test('API returns HTTP 500 with DATABASE_ERROR when repository query throws', async () => {
    historyRepo.setSimulateDbError(true);

    const res = await fetch(`${baseUrl}/listening-analysis`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    assert.equal(res.status, 500);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.message, 'Thông tin phân tích tạm thời không khả dụng, vui lòng thử lại sau');
    assert.equal(body.data, null);
    assert.equal(body.error?.code, 'DATABASE_ERROR');
  });
});
