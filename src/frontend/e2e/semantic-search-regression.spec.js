import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const pageSource = fs.readFileSync(new URL('../src/pages/Search/SearchPage.jsx', import.meta.url), 'utf8')

test('semantic search regression keeps existing search modes isolated', () => {
  assert.match(pageSource, /useMetadataSearch\(/)
  assert.match(pageSource, /useLyricsSearch\(/)
  assert.match(pageSource, /useSemanticSearch\(/)
  assert.match(pageSource, /<SongRow/)
})

test('semantic search regression preserves fallback and pagination UI', () => {
  assert.match(pageSource, /keyword_fallback/)
  assert.match(pageSource, /has_more/)
  assert.match(pageSource, /Load More/)
})
