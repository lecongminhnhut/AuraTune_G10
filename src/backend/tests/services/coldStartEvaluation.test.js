import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getPersonalizedRecommendations } from '../../services/recommendationService.js';
import * as signalRepo from '../../repositories/preferenceSignalRepository.js';
import * as catalogRepo from '../../repositories/catalogRepository.js';

describe('Cold-Start Evaluation - Unit Tests (T019 - US2)', () => {
  const newUser = 'u-new-account';

  beforeEach(() => {
    signalRepo.setUseInMemory(true);
    catalogRepo.setUseInMemory(true);
    signalRepo.clearInMemorySignals(newUser);
  });

  test('new account with 0 plays, 0 likes, 0 follows returns cold-start fallback (FR-005, SC-002)', async () => {
    const result = await getPersonalizedRecommendations(newUser, {
      type: 'all',
      limit: 10,
    });

    assert.equal(result.isFallback, true);
    assert.equal(result.fallbackReason, 'COLD_START');
    assert.equal(result.userId, newUser);
    assert.ok(result.items.length > 0);

    // Verify badges
    const songItems = result.items.filter((i) => i.type === 'song');
    const playlistItems = result.items.filter((i) => i.type === 'playlist');

    assert.ok(songItems.length > 0);
    songItems.forEach((song) => {
      assert.equal(song.badge, 'Phổ biến');
    });

    if (playlistItems.length > 0) {
      playlistItems.forEach((pl) => {
        assert.equal(pl.badge, 'Thịnh hành');
      });
    }
  });

  test('account with < 3 qualifying plays (< 30s) triggers cold-start fallback', async () => {
    signalRepo.setInMemorySignals(newUser, {
      history: [
        { song_id: 't1', listened_duration: 10 }, // < 30s
        { song_id: 't2', listened_duration: 25 }, // < 30s
      ],
      likes: [],
      follows: [],
    });

    const result = await getPersonalizedRecommendations(newUser, {
      type: 'all',
      limit: 10,
    });

    assert.equal(result.isFallback, true);
    assert.equal(result.fallbackReason, 'COLD_START');
    assert.ok(result.items.length > 0);
  });

  test('purged history immediately transitions account to cold-start baseline (Scenario 5, AF-03)', async () => {
    // 1. User initially has rich history
    signalRepo.setInMemorySignals(newUser, {
      history: [
        { song_id: 't1', listened_duration: 120 },
        { song_id: 't2', listened_duration: 180 },
        { song_id: 't3', listened_duration: 150 },
      ],
      likes: ['t1'],
      follows: ['hoang-dung'],
    });

    // 2. User purges history and removes likes/follows
    signalRepo.clearInMemorySignals(newUser);

    // 3. Next recommendation request must transition immediately to cold-start
    const result = await getPersonalizedRecommendations(newUser, {
      type: 'all',
      limit: 10,
    });

    assert.equal(result.isFallback, true);
    assert.equal(result.fallbackReason, 'COLD_START');
    assert.ok(result.items.length > 0);
  });
});
