import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTotalDuration,
  calculateListeningAnalysis,
} from '../../services/listeningAnalysisService.js';
import * as historyRepo from '../../repositories/historyRepository.js';

describe('Listening Analysis Service - Unit Tests (T009 - US1 MVP)', () => {
  beforeEach(() => {
    historyRepo.setSimulateDbError(false);
  });

  describe('Duration formatting (formatTotalDuration)', () => {
    test('formats 0 seconds as "0 phút"', () => {
      assert.equal(formatTotalDuration(0), '0 phút');
      assert.equal(formatTotalDuration(null), '0 phút');
      assert.equal(formatTotalDuration(-10), '0 phút');
    });

    test('rounds 45 seconds to "1 phút"', () => {
      assert.equal(formatTotalDuration(45), '1 phút');
    });

    test('formats 3660 seconds as "1 giờ 1 phút"', () => {
      assert.equal(formatTotalDuration(3660), '1 giờ 1 phút');
    });

    test('formats 86400 seconds as "24 giờ 0 phút"', () => {
      assert.equal(formatTotalDuration(86400), '24 giờ 0 phút');
    });

    test('formats 48250 seconds as "13 giờ 24 phút" per contract example', () => {
      assert.equal(formatTotalDuration(48250), '13 giờ 24 phút');
    });
  });

  describe('Genre aggregation, ranking, and tie-breaking', () => {
    test('ranks genres primarily by accumulated duration descending', async () => {
      const now = new Date().toISOString();
      const testRecords = [
        { id: '1', user_id: 'user-test', song_id: 't-pop', listened_duration: 300, played_at: now },
        { id: '2', user_id: 'user-test', song_id: 't-rock', listened_duration: 600, played_at: now },
        { id: '3', user_id: 'user-test', song_id: 't-jazz', listened_duration: 100, played_at: now },
      ];

      // Custom mock data for test
      historyRepo.setInMemoryHistory(testRecords);

      // Supply custom songs in test by patching or providing song details
      const result = await calculateListeningAnalysis('user-test', 'all', {
        customSongs: {
          't-pop': { genre: 'vpop' },
          't-rock': { genre: 'indie' },
          't-jazz': { genre: 'chill' },
        },
      });

      assert.equal(result.hasSufficientData, true);
      assert.equal(result.totalDurationSeconds, 1000);
      assert.equal(result.topGenres.length, 3);
      assert.equal(result.topGenres[0].genreId, 'indie');
      assert.equal(result.topGenres[0].rank, 1);
      assert.equal(result.topGenres[0].accumulatedSeconds, 600);
      assert.equal(result.topGenres[0].percentage, 60.0);

      assert.equal(result.topGenres[1].genreId, 'vpop');
      assert.equal(result.topGenres[1].rank, 2);
      assert.equal(result.topGenres[1].accumulatedSeconds, 300);
      assert.equal(result.topGenres[1].percentage, 30.0);

      assert.equal(result.topGenres[2].genreId, 'chill');
      assert.equal(result.topGenres[2].rank, 3);
      assert.equal(result.topGenres[2].accumulatedSeconds, 100);
      assert.equal(result.topGenres[2].percentage, 10.0);
    });

    test('breaks tie by plays count when accumulated durations are identical', async () => {
      const now = new Date().toISOString();
      // Genre A: 2 plays of 150s = 300s total
      // Genre B: 1 play of 300s = 300s total
      // Genre A wins tie because plays count is 2 > 1
      const testRecords = [
        { id: '1', user_id: 'user-tie', song_id: 'song-a1', listened_duration: 150, played_at: now },
        { id: '2', user_id: 'user-tie', song_id: 'song-a2', listened_duration: 150, played_at: now },
        { id: '3', user_id: 'user-tie', song_id: 'song-b1', listened_duration: 300, played_at: now },
      ];

      historyRepo.setInMemoryHistory(testRecords);

      const result = await calculateListeningAnalysis('user-tie', 'all', {
        customSongs: {
          'song-a1': { genre: 'vpop' },
          'song-a2': { genre: 'vpop' },
          'song-b1': { genre: 'indie' },
        },
      });

      assert.equal(result.topGenres[0].genreId, 'vpop');
      assert.equal(result.topGenres[0].accumulatedSeconds, 300);
      assert.equal(result.topGenres[1].genreId, 'indie');
      assert.equal(result.topGenres[1].accumulatedSeconds, 300);
    });

    test('breaks tie by alphabetical genre name when duration and plays count are equal', async () => {
      const now = new Date().toISOString();
      const testRecords = [
        { id: '1', user_id: 'user-alpha', song_id: 's-z', listened_duration: 200, played_at: now },
        { id: '2', user_id: 'user-alpha', song_id: 's-a', listened_duration: 200, played_at: now },
      ];

      historyRepo.setInMemoryHistory(testRecords);

      const result = await calculateListeningAnalysis('user-alpha', 'all', {
        customSongs: {
          's-z': { genre: 'vpop' },    // V-Pop
          's-a': { genre: 'ballad' },  // Ballad
        },
      });

      assert.equal(result.topGenres[0].genreId, 'ballad'); // B comes before V
      assert.equal(result.topGenres[1].genreId, 'vpop');
    });

    test('excludes songs with empty or null genre from topGenres but keeps duration in totalDurationSeconds (FR-012)', async () => {
      const now = new Date().toISOString();
      const testRecords = [
        { id: '1', user_id: 'user-null-genre', song_id: 's-valid', listened_duration: 300, played_at: now },
        { id: '2', user_id: 'user-null-genre', song_id: 's-no-genre', listened_duration: 200, played_at: now },
      ];

      historyRepo.setInMemoryHistory(testRecords);

      const result = await calculateListeningAnalysis('user-null-genre', 'all', {
        customSongs: {
          's-valid': { genre: 'ballad' },
          's-no-genre': { genre: null },
        },
      });

      assert.equal(result.totalDurationSeconds, 500); // 300 + 200
      assert.equal(result.totalPlays, 2);
      assert.equal(result.topGenres.length, 1);
      assert.equal(result.topGenres[0].genreId, 'ballad');
      assert.equal(result.topGenres[0].accumulatedSeconds, 300);
      assert.equal(result.topGenres[0].percentage, 100.0);
    });
  });

  describe('Date window filtering (7, 30, all)', () => {
    test('filters out playback events older than 7 days when range=7', async () => {
      const now = Date.now();
      const testRecords = [
        { id: '1', user_id: 'user-range', song_id: 's1', listened_duration: 100, played_at: new Date(now - 2 * 86400000).toISOString() }, // 2 days ago (in 7)
        { id: '2', user_id: 'user-range', song_id: 's2', listened_duration: 200, played_at: new Date(now - 10 * 86400000).toISOString() }, // 10 days ago (out of 7, in 30)
        { id: '3', user_id: 'user-range', song_id: 's3', listened_duration: 300, played_at: new Date(now - 40 * 86400000).toISOString() }, // 40 days ago (out of 30, in all)
      ];

      historyRepo.setInMemoryHistory(testRecords);

      const customSongs = {
        's1': { genre: 'chill' },
        's2': { genre: 'chill' },
        's3': { genre: 'chill' },
      };

      const result7 = await calculateListeningAnalysis('user-range', '7', { customSongs });
      assert.equal(result7.totalDurationSeconds, 100);
      assert.equal(result7.totalPlays, 1);

      const result30 = await calculateListeningAnalysis('user-range', '30', { customSongs });
      assert.equal(result30.totalDurationSeconds, 300); // 100 + 200
      assert.equal(result30.totalPlays, 2);

      const resultAll = await calculateListeningAnalysis('user-range', 'all', { customSongs });
      assert.equal(resultAll.totalDurationSeconds, 600); // 100 + 200 + 300
      assert.equal(resultAll.totalPlays, 3);
    });
  });
});
