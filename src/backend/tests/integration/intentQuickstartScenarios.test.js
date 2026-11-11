import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import {
  INTENT_TYPES,
  COMPLETENESS_STATUS,
  SUGGESTED_ACTIONS,
  CONTROL_ACTIONS,
} from '../../constants/intentConstants.js';

describe('quickstartScenarios (T040 - End-to-End Validation of All 8 Scenarios from quickstart.md)', () => {
  // Scenario 1: Specific Song & Artist Playback Request (FR-001, FR-002, FR-003)
  test('Scenario 1: Specific Song & Artist Playback Request', async () => {
    const prompt = 'bật bài Chúng ta của hiện tại của Sơn Tùng M-TP';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.ok(result.confidenceScore >= 0.9, 'Confidence score should be >= 0.90');
    assert.equal(result.extractedEntities.songTitle, 'Chúng ta của hiện tại');
    assert.equal(result.extractedEntities.artistName, 'Sơn Tùng M-TP');
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.PLAY);
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE);
    assert.equal(result.completenessStatus, COMPLETENESS_STATUS.COMPLETE);
  });

  // Scenario 2: Contextual Track Query & Relative Volume Control (FR-004)
  test('Scenario 2: Contextual Track Query & Relative Volume Control', async () => {
    const context = {
      currentTrack: { id: 'song-1', title: 'Ánh Nắng Của Anh', artist: 'Đức Phúc' },
      isPlaying: true,
      volume: 60,
    };

    // Sub-test 2A - Track Query
    const queryResult = await analyzeIntent('bài đang phát là gì thế?', context);
    assert.equal(queryResult.intentType, INTENT_TYPES.QUERY_MUSIC_INFO);
    assert.equal(queryResult.extractedEntities.targetTrackId, 'song-1');
    assert.equal(queryResult.suggestedAction, SUGGESTED_ACTIONS.DIALOGUE_RESPONSE);

    // Sub-test 2B - Relative Volume (-20%)
    const volumeResult = await analyzeIntent('giảm âm lượng', context);
    assert.equal(volumeResult.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(volumeResult.extractedEntities.controlAction, CONTROL_ACTIONS.SET_VOLUME);
    assert.equal(volumeResult.extractedEntities.volumeLevel, 40); // 60 - 20
    assert.equal(volumeResult.suggestedAction, SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE);
  });

  // Scenario 3: Music Discovery by Mood and Context (FR-002, FR-003)
  test('Scenario 3: Music Discovery by Mood and Context', async () => {
    const prompt = 'tìm cho mình mấy bài chill để học bài đêm khuya';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.SEARCH_MUSIC);
    assert.equal(result.extractedEntities.mood, 'chill');
    assert.equal(result.extractedEntities.activity, 'học bài đêm khuya');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.RECOMMENDATION_SERVICE);
  });

  // Scenario 4: Compound Chained Request Decomposition (FR-005)
  test('Scenario 4: Compound Chained Request Decomposition', async () => {
    const prompt = 'phát nhạc chill rồi giảm âm lượng 40%';
    const result = await analyzeIntent(prompt);

    assert.equal(result.clauses.length, 2);

    assert.equal(result.clauses[0].rawClauseText, 'phát nhạc chill');
    assert.equal(result.clauses[0].intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.clauses[0].extractedEntities.mood, 'chill');

    assert.equal(result.clauses[1].rawClauseText, 'giảm âm lượng 40%');
    assert.equal(result.clauses[1].intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.clauses[1].extractedEntities.controlAction, CONTROL_ACTIONS.SET_VOLUME);
    assert.equal(result.clauses[1].extractedEntities.volumeLevel, 40);
  });

  // Scenario 5: Vague Request with Smart Heuristic Defaults (FR-005)
  test('Scenario 5: Vague Request with Smart Heuristic Defaults', async () => {
    const prompt = 'bật nhạc lên';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.completenessStatus, COMPLETENESS_STATUS.MISSING_PARAMETERS);
    assert.equal(result.inferredDefaults?.default_source, 'personalized_or_trending');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE);
  });

  // Scenario 6: Non-Music Chit-Chat Isolation (FR-002, SC-004)
  test('Scenario 6: Non-Music Chit-Chat Isolation', async () => {
    const prompt = 'hôm nay thời tiết thế nào bạn ơi?';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.GENERAL_CHITCHAT);
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.DIALOGUE_RESPONSE);
  });

  // Scenario 7: Sensitive PII Scrubbing Compliance (FR-008, SC-003)
  test('Scenario 7: Sensitive PII Scrubbing Compliance', async () => {
    const prompt = 'Tôi là Nam, email nam99@gmail.com, số điện thoại 0912345678, hãy bật nhạc Trịnh';
    const result = await analyzeIntent(prompt);

    assert.equal(
      result.sanitizedPrompt,
      'Tôi là Nam, email [EMAIL_REDACTED], số điện thoại [PHONE_REDACTED], hãy bật nhạc Trịnh'
    );
    assert.equal(result.extractedEntities.artistName, 'Trịnh');
    assert.ok(!result.sanitizedPrompt.includes('nam99@gmail.com'));
    assert.ok(!result.sanitizedPrompt.includes('0912345678'));
  });

  // Scenario 8: Fallback to Tier-2 Rule Matcher on AI Outage (FR-010, SC-005)
  test('Scenario 8: Fallback to Tier-2 Rule Matcher on AI Outage', async () => {
    const prompt = 'tạm dừng nhạc';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.PAUSE);
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE);
  });
});
