import test from 'node:test'
import assert from 'node:assert/strict'
import { combineSemanticScores, deduplicateSemanticResults } from '../services/semanticRanking.js'

test('semantic ensemble uses 30/40/30 weights and re-normalizes missing dimensions', () => {
  assert.equal(combineSemanticScores({ metadata: 1, lyrics: 0, audio: 0 }), 0.3)
  assert.equal(combineSemanticScores({ metadata: 1, lyrics: null, audio: 0 }), 0.5)
})

test('semantic results deduplicate and use deterministic catalog tie breaking', () => {
  const catalog = new Map([['1', { total_plays: 2 }], ['2', { total_plays: 10 }]])
  const result = deduplicateSemanticResults([{ id: '1', score: 0.5 }, { id: '1', score: 0.7 }, { id: '2', score: 0.7 }], catalog)
  assert.deepEqual(result.map((item) => item.id), ['2', '1'])
  assert.equal(result[1].score, 0.7)
})
