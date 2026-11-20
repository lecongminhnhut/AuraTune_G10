import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import { INTENT_TYPES, CONTROL_ACTIONS } from '../../constants/intentConstants.js';

describe('intentCompoundClauses (T026 - US4 Compound Clause Integration - FR-005)', () => {
  test('decomposes "phát nhạc chill rồi giảm âm lượng 40%" into 2 sequential clauses', async () => {
    const prompt = 'phát nhạc chill rồi giảm âm lượng 40%';
    const result = await analyzeIntent(prompt);

    assert.equal(result.clauses.length, 2);

    // Clause 0: phát nhạc chill
    const clause0 = result.clauses[0];
    assert.equal(clause0.clauseIndex, 0);
    assert.equal(clause0.rawClauseText, 'phát nhạc chill');
    assert.equal(clause0.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(clause0.extractedEntities.mood, 'chill');

    // Clause 1: giảm âm lượng 40%
    const clause1 = result.clauses[1];
    assert.equal(clause1.clauseIndex, 1);
    assert.equal(clause1.rawClauseText, 'giảm âm lượng 40%');
    assert.equal(clause1.intentType, INTENT_TYPES.PLAY_MUSIC);
    assert.equal(clause1.extractedEntities.controlAction, CONTROL_ACTIONS.SET_VOLUME);
    assert.equal(clause1.extractedEntities.volumeLevel, 40);
  });

  test('decomposes clauses separated by comma and "sau đó"', async () => {
    const prompt = 'bật bài Nơi này có anh, sau đó chuyển bài';
    const result = await analyzeIntent(prompt);

    assert.equal(result.clauses.length, 2);
    assert.equal(result.clauses[0].clauseIndex, 0);
    assert.equal(result.clauses[0].extractedEntities.songTitle, 'Nơi này có anh');
    assert.equal(result.clauses[1].clauseIndex, 1);
    assert.equal(result.clauses[1].extractedEntities.controlAction, CONTROL_ACTIONS.NEXT);
  });
});
