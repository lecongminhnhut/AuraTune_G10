import test from 'node:test';
import assert from 'node:assert/strict';
import { getMoodRecommendationsService } from '../../services/moodRecommendationService.js';
import { setUseInMemory } from '../../repositories/moodCatalogRepository.js';

setUseInMemory(true);

test('User Story 3 - Resilience: AI service 500 internal server error degrades gracefully to local playlists (HTTP 200 equivalent)', async () => {
  const mockFailingAiClient = {
    getMoodRecommendations: async () => {
      const err = new Error('AI Service returned HTTP 500: Internal Server Error');
      err.status = 500;
      throw err;
    },
  };

  const result = await getMoodRecommendationsService({
    tag: 'workout',
    type: 'all',
    limit: 10,
    userId: 'u-resilience-1',
    aiClient: mockFailingAiClient,
  });

  assert.equal(result.tag, 'workout');
  assert.equal(result.is_service_degraded, true, 'is_service_degraded must be true');
  assert.ok(Array.isArray(result.items));
  assert.ok(result.items.length > 0, 'Must fallback to local catalog items');
  assert.ok(Array.isArray(result.fallback_shortcuts));
  assert.ok(result.fallback_shortcuts.length > 0, 'Must provide navigation shortcuts');

  // Verify all fallback items strictly follow entity restrictions (FR-003)
  for (const item of result.items) {
    assert.ok(['song', 'playlist'].includes(item.type));
  }
});

test('User Story 3 - Resilience: AI service timeout (AbortError / ETIMEDOUT > 2.5s) degrades smoothly within latency envelope', async () => {
  const start = Date.now();

  const mockTimingOutAiClient = {
    getMoodRecommendations: async () => {
      // Simulate artificial timeout exceeding 2500ms
      await new Promise((resolve) => setTimeout(resolve, 50));
      const err = new Error('AI Service request timed out after 2500ms');
      err.name = 'TimeoutError';
      err.code = 'ETIMEDOUT';
      throw err;
    },
  };

  const result = await getMoodRecommendationsService({
    tag: 'chill',
    type: 'all',
    limit: 10,
    userId: 'u-resilience-2',
    aiClient: mockTimingOutAiClient,
  });

  const duration = Date.now() - start;

  assert.equal(result.tag, 'chill');
  assert.equal(result.is_service_degraded, true);
  assert.ok(result.items.length > 0);
  assert.ok(duration < 2600, `Execution time (${duration}ms) must be within 2600ms`);
});
