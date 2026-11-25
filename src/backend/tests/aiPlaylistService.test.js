import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { candidateIds, normalizeAiPlaylistResponse } from '../services/aiPlaylistService.js';

// Feature 064 T010: AI suggestions are hydrated from the catalog and filtered for availability.

const song = (id, extra = {}) => ({ song_id: id, title: `Song ${id}`, artist: 'HoliznaCC0', album: 'Lo-fi And Chill', duration: 160, is_active: true, ...extra });
const catalogOf = (songs) => async (ids) => new Map(songs.filter((item) => ids.includes(item.song_id)).map((item) => [item.song_id, item]));
const ids = (count, start = 1) => Array.from({ length: count }, (_, index) => String(start + index));

describe('candidateIds', () => {
  test('keeps AI order, removes duplicates and malformed ids', () => {
    const response = { tracks: [{ song_id: 3 }, { id: '1' }, { song_id: '3' }, '7', { song_id: '../x' }, null, {}] };
    assert.deepEqual(candidateIds(response), ['3', '1', '7']);
  });

  test('tolerates missing or malformed track lists', () => {
    assert.deepEqual(candidateIds(null), []);
    assert.deepEqual(candidateIds({ tracks: 'nope' }), []);
  });
});

describe('normalizeAiPlaylistResponse', () => {
  test('returns 10-20 catalog tracks in AI order with catalog metadata', async () => {
    const catalog = ids(25).map((id) => song(id));
    const response = { title: '  Lofi học bài  ', reason: 'Nhịp chậm, không lời', tracks: ids(25).reverse().map((id) => ({ song_id: id, title: 'AI title ignored' })) };
    const result = await normalizeAiPlaylistResponse(response, 'lofi để học', { findSongs: catalogOf(catalog) });
    assert.equal(result.title, 'Lofi học bài');
    assert.equal(result.reason, 'Nhịp chậm, không lời');
    assert.equal(result.tracks.length, 20);
    assert.equal(result.tracks[0].song_id, '25');
    assert.equal(result.tracks[0].title, 'Song 25');
    assert.equal(result.tracks[0].artist, 'HoliznaCC0');
    assert.equal(result.noMatch, undefined);
  });

  test('drops unknown, inactive and restricted songs before counting', async () => {
    const catalog = [...ids(10).map((id) => song(id)), song('11', { is_active: false }), song('12', { is_active: false })];
    const response = { tracks: [...ids(12), '99'].map((id) => ({ song_id: id })) };
    const result = await normalizeAiPlaylistResponse(response, 'chill', { findSongs: catalogOf(catalog) });
    assert.deepEqual(result.tracks.map((track) => track.song_id), ids(10));
  });

  test('reports noMatch when fewer than 10 eligible tracks remain', async () => {
    const catalog = [...ids(9).map((id) => song(id)), song('10', { is_active: false })];
    const result = await normalizeAiPlaylistResponse({ tracks: ids(10).map((id) => ({ song_id: id })) }, 'jazz', { findSongs: catalogOf(catalog) });
    assert.deepEqual(result.tracks, []);
    assert.equal(result.noMatch, true);
  });

  test('falls back to the prompt for the title and reports noMatch for empty answers', async () => {
    const result = await normalizeAiPlaylistResponse({ title: '   ', tracks: [] }, '  nhạc mưa  ', { findSongs: catalogOf([]) });
    assert.equal(result.title, 'nhạc mưa');
    assert.equal(result.noMatch, true);
  });
});
