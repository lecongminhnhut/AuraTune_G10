import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import { INTENT_TYPES, SUGGESTED_ACTIONS } from '../../constants/intentConstants.js';

describe('intentSearchExtraction (T016 - US2 Search & Discovery Extraction - FR-002, FR-003)', () => {
  test('extracts mood and activity accurately for discovery recommendation', async () => {
    const prompt = 'tìm cho mình mấy bài chill để học bài đêm khuya';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.SEARCH_MUSIC);
    assert.equal(result.extractedEntities.mood, 'chill');
    assert.ok(
      result.extractedEntities.activity.includes('học bài'),
      `Expected activity to include 'học bài', got: ${result.extractedEntities.activity}`
    );
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.RECOMMENDATION_SERVICE);
    assert.equal(result.completenessStatus, 'complete');
  });

  test('extracts genre and mood for music recommendation', async () => {
    const prompt = 'gợi ý các bài hát pop sôi động';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.SEARCH_MUSIC);
    assert.equal(result.extractedEntities.genre, 'pop');
    assert.equal(result.extractedEntities.mood, 'sôi động');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.RECOMMENDATION_SERVICE);
  });

  test('extracts lyrics snippet from search query', async () => {
    const prompt = 'tìm bài hát có lời là "dù cho mai về sau"';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.SEARCH_MUSIC);
    assert.equal(result.extractedEntities.lyricsSnippet, 'dù cho mai về sau');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.SEARCH_SERVICE);
  });

  test('extracts album and artist from album search query', async () => {
    const prompt = 'tìm album 25 của Adele';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.SEARCH_MUSIC);
    assert.equal(result.extractedEntities.albumTitle, '25');
    assert.equal(result.extractedEntities.artistName, 'Adele');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.SEARCH_SERVICE);
  });

  test('extracts song title from explicit search query', async () => {
    const prompt = 'tìm kiếm bài hát Nắng ấm xa dần';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.SEARCH_MUSIC);
    assert.equal(result.extractedEntities.songTitle, 'Nắng ấm xa dần');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.SEARCH_SERVICE);
  });
});
