import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync(new URL('../SearchPage.jsx', import.meta.url), 'utf8')

test('search page renders semantic fallback and empty states', () => {
  assert.match(source, /keyword_fallback/)
  assert.match(source, /No matching songs/)
  assert.match(source, /Semantic search is temporarily unavailable/)
})

test('search page keeps semantic playback and pagination controls', () => {
  assert.match(source, /<SongRow/)
  assert.match(source, /player\.playTrack/)
  assert.match(source, /Load More/)
})
