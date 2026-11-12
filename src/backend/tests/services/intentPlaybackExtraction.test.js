import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import { INTENT_TYPES, CONTROL_ACTIONS } from '../../constants/intentConstants.js';

describe('intentPlaybackExtraction (T010 - US1 Playback & Control Extraction - FR-002, FR-003)', () => {
  test('extracts specific song title and artist correctly', async () => {
    const prompt = 'bật bài Chúng ta của hiện tại của Sơn Tùng M-TP';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.ok(result.confidenceScore >= 0.9, `Confidence should be >= 0.9, got ${result.confidenceScore}`);
    assert.equal(result.completenessStatus, 'complete');
    assert.equal(result.extractedEntities.songTitle, 'Chúng ta của hiện tại');
    assert.equal(result.extractedEntities.artistName, 'Sơn Tùng M-TP');
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.PLAY);
    assert.equal(result.suggestedAction, 'real_time_assistance');
  });

  test('extracts track title when artist is omitted', async () => {
    const prompt = 'phát bài Nơi này có anh';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.extractedEntities.songTitle, 'Nơi này có anh');
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.PLAY);
  });

  test('extracts artist name when title is omitted', async () => {
    const prompt = 'mở nhạc Đen Vâu';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.extractedEntities.artistName, 'Đen Vâu');
  });

  test('extracts pause playback control action', async () => {
    const prompts = ['tạm dừng nhạc', 'dừng lại', 'pause', 'stop'];
    for (const prompt of prompts) {
      const result = await analyzeIntent(prompt);
      assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
      assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.PAUSE);
      assert.equal(result.suggestedAction, 'real_time_assistance');
    }
  });

  test('extracts resume playback control action', async () => {
    const prompts = ['tiếp tục phát', 'phát tiếp', 'resume'];
    for (const prompt of prompts) {
      const result = await analyzeIntent(prompt);
      assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
      assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.RESUME);
    }
  });

  test('extracts next track playback control action', async () => {
    const prompts = ['chuyển bài', 'tiếp theo', 'next', 'qua bài khác'];
    for (const prompt of prompts) {
      const result = await analyzeIntent(prompt);
      assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
      assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.NEXT);
    }
  });

  test('extracts previous track playback control action', async () => {
    const prompts = ['quay lại', 'bài trước', 'previous'];
    for (const prompt of prompts) {
      const result = await analyzeIntent(prompt);
      assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
      assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.PREVIOUS);
    }
  });

  test('extracts explicit volume level setting', async () => {
    const prompt = 'chỉnh âm lượng 80%';
    const result = await analyzeIntent(prompt);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.SET_VOLUME);
    assert.equal(result.extractedEntities.volumeLevel, 80);
    assert.equal(result.suggestedAction, 'real_time_assistance');
  });
});
