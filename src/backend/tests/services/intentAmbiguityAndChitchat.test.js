import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import { INTENT_TYPES, COMPLETENESS_STATUS, SUGGESTED_ACTIONS } from '../../constants/intentConstants.js';

describe('intentAmbiguityAndChitchat (T025 - US4 Ambiguity, Defaults & Chit-chat - FR-002, FR-005, SC-004)', () => {
  test('assigns smart heuristic defaults for vague playback request "bật nhạc lên"', async () => {
    const prompt = 'bật nhạc lên';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.completenessStatus, COMPLETENESS_STATUS.MISSING_PARAMETERS);
    assert.ok(result.inferredDefaults);
    assert.equal(result.inferredDefaults.default_source, 'personalized_or_trending');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE);
  });

  test('assigns smart heuristic defaults for "mở nhạc đi"', async () => {
    const prompt = 'mở nhạc đi';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.completenessStatus, COMPLETENESS_STATUS.MISSING_PARAMETERS);
    assert.equal(result.inferredDefaults?.default_source, 'personalized_or_trending');
  });

  test('classifies general banter and weather questions as general_chitchat', async () => {
    const prompts = [
      'hôm nay thời tiết thế nào bạn ơi?',
      'hôm nay ăn gì nhỉ?',
      'chào bạn, bạn là ai?',
    ];

    for (const prompt of prompts) {
      const result = await analyzeIntent(prompt);
      assert.equal(result.intentType, INTENT_TYPES.GENERAL_CHITCHAT);
      assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.DIALOGUE_RESPONSE);
      assert.equal(result.completenessStatus, COMPLETENESS_STATUS.COMPLETE);
    }
  });

  test('classifies completely unrecognized random text as unknown fallback', async () => {
    const prompt = 'xyz123abc randomgibberish 999';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.UNKNOWN);
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.UNRECOGNIZED_FALLBACK);
  });
});
