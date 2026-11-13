import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getMoodRecommendationsService,
} from '../../services/moodRecommendationService.js';
import { setUseInMemory } from '../../repositories/moodCatalogRepository.js';

setUseInMemory(true);

test('User Story 1 - Service: validates and resolves mood recommendation stream for valid tag', async () => {
  const mockAiClient = {
    getMoodRecommendations: async () => ({
      status: 'success',
      candidates: [
        { type: 'song', id: 't8', score: 0.98 },
        { type: 'playlist', id: 'lofi-chill', score: 0.95 },
      ],
    }),
  };

  const result = await getMoodRecommendationsService({
    tag: 'chill',
    type: 'all',
    limit: 20,
    userId: 'user-test-1',
    aiClient: mockAiClient,
  });

  assert.equal(result.tag, 'chill');
  assert.equal(result.tag_category, 'mood');
  assert.equal(result.is_service_degraded, false);
  assert.ok(Array.isArray(result.items));
  assert.ok(result.items.length > 0, 'Should return matching candidates for chill');
  assert.equal(result.total_items, result.items.length);
});

test('User Story 1 - Service: strictly enforces entity restrictions (ONLY songs and playlists, NO albums or artists)', async () => {
  const mockAiClient = {
    getMoodRecommendations: async () => ({
      status: 'success',
      candidates: [
        { type: 'song', id: 't8', score: 0.99 },
        { type: 'playlist', id: 'lofi-chill', score: 0.95 },
        { type: 'album', id: 'al-lofi-cua-so', score: 0.90 }, // MUST BE DROPPED
        { type: 'artist', id: 'auratune-studio', score: 0.85 }, // MUST BE DROPPED
      ],
    }),
  };

  const result = await getMoodRecommendationsService({
    tag: 'chill',
    type: 'all',
    limit: 20,
    userId: 'user-test-1',
    aiClient: mockAiClient,
  });

  const types = result.items.map((i) => i.type);
  assert.ok(types.includes('song'), 'Should include songs');
  assert.ok(types.includes('playlist'), 'Should include playlists');
  assert.ok(!types.includes('album'), 'MUST NOT include albums per FR-003');
  assert.ok(!types.includes('artist'), 'MUST NOT include artists per FR-003');
});

test('User Story 1 - Service: deduplicates identical (type, id) candidate pairs', async () => {
  const mockAiClient = {
    getMoodRecommendations: async () => ({
      status: 'success',
      candidates: [
        { type: 'song', id: 't8', score: 0.99 },
        { type: 'song', id: 't8', score: 0.80 }, // Duplicate
        { type: 'playlist', id: 'lofi-chill', score: 0.95 },
        { type: 'playlist', id: 'lofi-chill', score: 0.70 }, // Duplicate
      ],
    }),
  };

  const result = await getMoodRecommendationsService({
    tag: 'chill',
    type: 'all',
    limit: 20,
    userId: 'user-test-1',
    aiClient: mockAiClient,
  });

  const ids = result.items.map((i) => `${i.type}:${i.id}`);
  const uniqueIds = Array.from(new Set(ids));
  assert.equal(ids.length, uniqueIds.length, 'All returned items must have unique (type, id) keys');
});

test('User Story 1 - Service: supports entity type filtering (type="song" or type="playlist")', async () => {
  const songsOnly = await getMoodRecommendationsService({
    tag: 'chill',
    type: 'song',
    limit: 10,
    userId: 'user-test-1',
  });

  for (const item of songsOnly.items) {
    assert.equal(item.type, 'song');
  }

  const playlistsOnly = await getMoodRecommendationsService({
    tag: 'chill',
    type: 'playlist',
    limit: 10,
    userId: 'user-test-1',
  });

  for (const item of playlistsOnly.items) {
    assert.equal(item.type, 'playlist');
  }
});
