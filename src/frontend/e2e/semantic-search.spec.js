import test from 'node:test'
import assert from 'node:assert/strict'
import { validateSemanticQuery } from '../src/utils/semanticQuery.js'

test('semantic search acceptance: local privacy gate rejects unusable queries', () => {
  assert.equal(validateSemanticQuery('   ').valid, false)
  assert.equal(validateSemanticQuery('x'.repeat(151)).valid, false)
  assert.equal(validateSemanticQuery('🌧️ chill').valid, true)
})

test('semantic search acceptance: meaning-preserving normalization trims only', () => {
  const result = validateSemanticQuery('  nhạc   cho   buổi   tối  ')
  assert.equal(result.query, 'nhạc   cho   buổi   tối')
  assert.equal(result.valid, true)
})
