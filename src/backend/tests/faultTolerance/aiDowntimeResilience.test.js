import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getPersonalizedRecommendations } from '../../services/recommendationService.js';
import * as signalRepo from '../../repositories/preferenceSignalRepository.js';
import * as catalogRepo from '../../repositories/catalogRepository.js';

describe('AI Downtime Resilience - Unit & Integration Tests (T024 - US3 / EF-01)', () => {
  const userId = 'u-test-resilience';

  beforeEach(() => {
    signalRepo.setUseInMemory(true);
    catalogRepo.setUseInMemory(true);
    // User with rich history so they would normally get AI recommendations
    signalRepo.setInMemorySignals(userId, {
      history: [
        { song_id: 't1', listened_duration: 120 },
        { song_id: 't2', listened_duration: 140 },
        { song_id: 't3', listened_duration: 160 },
      ],
      likes: ['t1'],
      follows: ['hoang-dung'],
    });
  });

  test('gracefully degrades to popular content on AI network disconnection', async () => {
    const brokenAiClient = async () => {
      const err = new Error('fetch failed - connection refused');
      err.code = 'ECONNREFUSED';
      throw err;
    };

    const result = await getPersonalizedRecommendations(userId, {
      type: 'all',
      limit: 10,
      aiClient: brokenAiClient,
    });

    assert.equal(result.isFallback, true);
    assert.equal(result.fallbackReason, 'AI_SERVICE_UNAVAILABLE');
    assert.equal(result.message, 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì');
    assert.ok(result.items.length > 0);
  });

  test('gracefully degrades to popular content on AI HTTP 500 Internal Server Error', async () => {
    const error500AiClient = async () => {
      const err = new Error('AI Service returned HTTP 500: Internal Model Crash');
      err.status = 500;
      throw err;
    };

    const result = await getPersonalizedRecommendations(userId, {
      type: 'all',
      limit: 10,
      aiClient: error500AiClient,
    });

    assert.equal(result.isFallback, true);
    assert.equal(result.fallbackReason, 'AI_SERVICE_UNAVAILABLE');
    assert.equal(result.message, 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì');
    assert.ok(result.items.length > 0);
  });

  test('gracefully degrades when AI microservice times out (> 2.5s)', async () => {
    const start = Date.now();
    const timeoutAiClient = async () => {
      // Simulate artificial delay exceeding timeout
      await new Promise((resolve) => setTimeout(resolve, 100));
      const timeoutError = new Error('AI Service request timed out after 100ms');
      timeoutError.name = 'TimeoutError';
      timeoutError.code = 'ETIMEDOUT';
      throw timeoutError;
    };

    const result = await getPersonalizedRecommendations(userId, {
      type: 'all',
      limit: 10,
      aiClient: timeoutAiClient,
    });

    const elapsed = Date.now() - start;
    assert.ok(elapsed < 2600);
    assert.equal(result.isFallback, true);
    assert.equal(result.fallbackReason, 'AI_SERVICE_UNAVAILABLE');
    assert.equal(result.message, 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì');
    assert.ok(result.items.length > 0);
  });
});
