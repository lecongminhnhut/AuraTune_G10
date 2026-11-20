import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync(new URL('../SemanticSearch.jsx', import.meta.url), 'utf8')

test('semantic input exposes accessible combobox and keyboard navigation', () => {
  assert.match(source, /role="combobox"/)
  assert.match(source, /ArrowDown/)
  assert.match(source, /ArrowUp/)
  assert.match(source, /Enter/)
})

test('semantic input submits through the semantic route state', () => {
  assert.match(source, /mode=semantic/)
  assert.match(source, /onPlayTrack/)
})
