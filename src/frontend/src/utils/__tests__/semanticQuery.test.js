import test from 'node:test'
import assert from 'node:assert/strict'
import { validateSemanticQuery } from '../semanticQuery.js'

test('semantic query validation preserves punctuation, emoji and supported language', () => {
  assert.equal(validateSemanticQuery('  Nhạc buồn 🌧️!!!  ').query, 'Nhạc buồn 🌧️!!!')
  assert.equal(validateSemanticQuery('🌧️ chill').error, null)
  assert.notEqual(validateSemanticQuery('   ').error, null)
  assert.notEqual(validateSemanticQuery('a'.repeat(151)).error, null)
})
