import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { planClause } from '../../src/utils/agentService.js';

describe('agentServiceSearchPlan (T017 - US2 Tier-2 Client Search & Discovery Plan)', () => {
  test('extracts mood and activity accurately for discovery recommendation', () => {
    const clause = 'tìm cho mình mấy bài chill để học bài đêm khuya';
    const result = planClause(clause);

    assert.equal(result.intentType, 'search_music');
    assert.equal(result.extractedEntities.mood, 'chill');
    assert.ok(result.extractedEntities.activity.includes('học bài'));
    assert.equal(result.suggestedAction, 'recommendation_service');
    assert.equal(result.completenessStatus, 'complete');
  });

  test('extracts lyrics snippet or search keywords', () => {
    const clause = 'tìm bài hát có lời là "dù cho mai về sau"';
    const result = planClause(clause);

    assert.equal(result.intentType, 'search_music');
    assert.ok(
      result.extractedEntities.lyricsSnippet === 'dù cho mai về sau' ||
      result.suggestedAction === 'search_service'
    );
  });

  test('extracts song search query', () => {
    const clause = 'tìm bài hát Nơi này có anh';
    const result = planClause(clause);

    assert.equal(result.intentType, 'search_music');
    assert.equal(result.extractedEntities.songTitle, 'Nơi này có anh');
    assert.equal(result.suggestedAction, 'search_service');
  });

  test('resolves contextual track query and relative volume in planClause (FR-004)', () => {
    const context = {
      currentTrack: { id: 'song-demo-1', title: 'Ánh Nắng Của Anh', artist: 'Đức Phúc' },
      isPlaying: true,
      volume: 60,
    };

    const queryResult = planClause('bài đang phát là gì?', context);
    assert.equal(queryResult.intentType, 'query_music_info');
    assert.equal(queryResult.extractedEntities.targetTrackId, 'song-demo-1');
    assert.equal(queryResult.extractedEntities.songTitle, 'Ánh Nắng Của Anh');
    assert.equal(queryResult.suggestedAction, 'dialogue_response');

    const volResult = planClause('giảm âm lượng', context);
    assert.equal(volResult.intentType, 'play_music');
    assert.equal(volResult.extractedEntities.controlAction, 'set_volume');
    assert.equal(volResult.extractedEntities.volumeLevel, 40); // 60 - 20
  });
});
