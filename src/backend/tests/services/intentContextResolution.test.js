import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import { INTENT_TYPES, CONTROL_ACTIONS, SUGGESTED_ACTIONS } from '../../constants/intentConstants.js';

describe('intentContextResolution (T020 - US3 Context Resolution - FR-004)', () => {
  const mockContext = {
    currentTrack: {
      id: 'song-1',
      title: 'Ánh Nắng Của Anh',
      artist: 'Đức Phúc',
    },
    isPlaying: true,
    volume: 60,
  };

  test('resolves deictic reference "bài đang phát là gì" against currentTrack snapshot', async () => {
    const prompt = 'bài đang phát là gì thế?';
    const result = await analyzeIntent(prompt, mockContext);

    assert.equal(result.intentType, INTENT_TYPES.QUERY_MUSIC_INFO);
    assert.equal(result.extractedEntities.targetTrackId, 'song-1');
    assert.equal(result.extractedEntities.songTitle, 'Ánh Nắng Của Anh');
    assert.equal(result.extractedEntities.artistName, 'Đức Phúc');
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.DIALOGUE_RESPONSE);
  });

  test('resolves deictic reference "ca sĩ này là ai" against currentTrack snapshot', async () => {
    const prompt = 'ca sĩ này là ai?';
    const result = await analyzeIntent(prompt, mockContext);

    assert.equal(result.intentType, INTENT_TYPES.QUERY_MUSIC_INFO);
    assert.equal(result.extractedEntities.targetTrackId, 'song-1');
    assert.equal(result.extractedEntities.artistName, 'Đức Phúc');
  });

  test('calculates relative volume decrease (-20%) from context volume', async () => {
    const prompt = 'giảm âm lượng';
    const result = await analyzeIntent(prompt, mockContext);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.SET_VOLUME);
    assert.equal(result.extractedEntities.volumeLevel, 40); // 60 - 20
    assert.equal(result.suggestedAction, SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE);
  });

  test('calculates relative volume increase (+20%) from context volume', async () => {
    const prompt = 'to lên';
    const result = await analyzeIntent(prompt, mockContext);

    assert.equal(result.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(result.extractedEntities.controlAction, CONTROL_ACTIONS.SET_VOLUME);
    assert.equal(result.extractedEntities.volumeLevel, 80); // 60 + 20
  });

  test('clamps relative volume between 0 and 100', async () => {
    const highContext = { volume: 95 };
    const resIncrease = await analyzeIntent('cho to lên', highContext);
    assert.equal(resIncrease.extractedEntities.volumeLevel, 100);

    const lowContext = { volume: 10 };
    const resDecrease = await analyzeIntent('nhỏ lại', lowContext);
    assert.equal(resDecrease.extractedEntities.volumeLevel, 0);
  });
});
