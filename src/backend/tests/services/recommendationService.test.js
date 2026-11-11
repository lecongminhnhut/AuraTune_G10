import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getPersonalizedRecommendations } from '../../services/recommendationService.js';
import * as signalRepo from '../../repositories/preferenceSignalRepository.js';
import * as catalogRepo from '../../repositories/catalogRepository.js';
import { hydrateCandidate, hydrateCandidates } from '../../services/catalogHydrationService.js';

describe('Personalized Recommendations Service - Unit Tests (T010 - US1 MVP)', () => {
  const userId = 'u-test-listener';

  beforeEach(() => {
    signalRepo.setUseInMemory(true);
    catalogRepo.setUseInMemory(true);
    // Seed user with > 3 qualifying plays so it's not cold-start
    signalRepo.setInMemorySignals(userId, {
      history: [
        { song_id: 't1', listened_duration: 100 },
        { song_id: 't2', listened_duration: 120 },
        { song_id: 't3', listened_duration: 90 },
      ],
      likes: ['t1'],
      follows: ['hoang-dung'],
    });
  });

  describe('Candidate Hydration & Metadata', () => {
    test('hydrates song candidate with title, subtitle, badge and audio_url extra', async () => {
      const item = await hydrateCandidate({ type: 'song', id: 't1' }, { isFallback: false });
      assert.ok(item);
      assert.equal(item.type, 'song');
      assert.equal(item.id, 't1');
      assert.equal(item.title, 'Nàng thơ');
      assert.equal(item.subtitle, 'Hoàng Dũng');
      assert.equal(item.badge, 'Gợi ý');
      assert.equal(item.target_id, 't1');
      assert.ok(item.extra);
      assert.equal(item.extra.duration, 261);
      assert.equal(item.extra.audio_url, '/api/v1/songs/t1/stream');
    });

    test('hydrates playlist candidate with track_count and is_official', async () => {
      const item = await hydrateCandidate({ type: 'playlist', id: 'lofi-chill' }, { isFallback: false });
      assert.ok(item);
      assert.equal(item.type, 'playlist');
      assert.equal(item.id, 'lofi-chill');
      assert.equal(item.badge, 'Gợi ý');
      assert.ok(item.extra.track_count > 0);
      assert.equal(item.extra.is_official, true);
    });

    test('hydrates artist candidate with follower_count', async () => {
      const item = await hydrateCandidate({ type: 'artist', id: 'vu' }, { isFallback: false });
      assert.ok(item);
      assert.equal(item.type, 'artist');
      assert.equal(item.title, 'Vũ.');
      assert.equal(item.badge, 'Gợi ý');
      assert.ok(item.extra.follower_count > 0);
    });

    test('hydrates album candidate with release_year and track_count', async () => {
      const item = await hydrateCandidate({ type: 'album', id: 'al-25' }, { isFallback: false });
      assert.ok(item);
      assert.equal(item.type, 'album');
      assert.equal(item.title, '25');
      assert.equal(item.badge, 'Gợi ý');
      assert.equal(item.extra.release_year, 2022);
    });

    test('silently drops missing or inactive/deleted entities (FR-008)', async () => {
      const missing = await hydrateCandidate({ type: 'song', id: 'nonexistent-id' });
      assert.equal(missing, null);

      const deleted = await hydrateCandidate({ type: 'song', id: 'deleted-song-99' });
      assert.equal(deleted, null);
    });
  });

  describe('Deduplication (FR-015)', () => {
    test('eliminates duplicate (type, id) candidate pairs', async () => {
      const candidates = [
        { type: 'song', id: 't1' },
        { type: 'song', id: 't2' },
        { type: 'song', id: 't1' }, // Duplicate
        { type: 'playlist', id: 'lofi-chill' },
        { type: 'playlist', id: 'lofi-chill' }, // Duplicate
      ];

      const hydrated = await hydrateCandidates(candidates);
      assert.equal(hydrated.length, 3);
      assert.deepEqual(
        hydrated.map((i) => `${i.type}:${i.id}`),
        ['song:t1', 'song:t2', 'playlist:lofi-chill']
      );
    });
  });

  describe('Multi-Entity Recommendation Flow (US1)', () => {
    test('returns personalized multi-entity recommendation feed with is_fallback: false', async () => {
      const mockAiClient = async () => ({
        status: 'success',
        model_version: 'v1.2.0-test',
        candidates: [
          { type: 'song', id: 't1', score: 0.98 },
          { type: 'playlist', id: 'lofi-chill', score: 0.92 },
          { type: 'artist', id: 'vu', score: 0.88 },
          { type: 'album', id: 'al-25', score: 0.85 },
        ],
      });

      const result = await getPersonalizedRecommendations(userId, {
        type: 'all',
        limit: 10,
        aiClient: mockAiClient,
      });

      assert.equal(result.isFallback, false);
      assert.equal(result.fallbackReason, null);
      assert.equal(result.userId, userId);
      assert.equal(result.items.length, 4);

      const types = result.items.map((i) => i.type);
      assert.ok(types.includes('song'));
      assert.ok(types.includes('playlist'));
      assert.ok(types.includes('artist'));
      assert.ok(types.includes('album'));

      result.items.forEach((item) => {
        assert.equal(item.badge, 'Gợi ý');
        assert.ok(item.title);
        assert.ok(item.target_id);
      });
    });

    test('filters output by requested type when type query parameter is provided', async () => {
      const mockAiClient = async () => ({
        status: 'success',
        model_version: 'v1.2.0-test',
        candidates: [
          { type: 'song', id: 't1', score: 0.98 },
          { type: 'playlist', id: 'lofi-chill', score: 0.92 },
          { type: 'song', id: 't2', score: 0.89 },
          { type: 'artist', id: 'vu', score: 0.88 },
        ],
      });

      const result = await getPersonalizedRecommendations(userId, {
        type: 'song',
        limit: 10,
        aiClient: mockAiClient,
      });

      assert.equal(result.isFallback, false);
      assert.equal(result.items.length, 2);
      result.items.forEach((item) => {
        assert.equal(item.type, 'song');
      });
    });
  });
});
