import test from 'node:test'
import assert from 'node:assert/strict'
import { createLyricsSearchController } from '../controllers/lyricsSearchController.js'
import { normalizeLyricText, rankLyricRows } from '../utils/lyricsSearch.js'

function response() {
  return { statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this } }
}

test('lyrics route maps approved AI success envelope', async () => {
  const controller = createLyricsSearchController({ aiSearch: async () => ({ data: [{ id: '1', matched_lyric: 'line' }], pagination: { limit: 20, offset: 0, next_offset: null, has_more: false } }), repository: { mapAiResults: async (data, pagination) => ({ data: [{ id: data[0].id, type: 'track', title: 'Song', artist: 'Artist', matched_lyric: data[0].matched_lyric }], pagination }) } })
  const result = response(); await controller({ query: { q: 'three lyric words' } }, result)
  assert.equal(result.statusCode, 200); assert.equal(result.body.meta.search_mode, 'ai'); assert.equal(result.body.data[0].matched_lyric, 'line')
})

test('503 automatically uses lyrics-only fallback', async () => {
  const controller = createLyricsSearchController({ aiSearch: async () => { const error = new Error('offline'); error.status = 503; throw error }, repository: { searchFallback: async () => ({ data: [], pagination: { limit: 20, offset: 0, next_offset: null, has_more: false } }) } })
  const result = response(); await controller({ query: { q: 'three lyric words' } }, result)
  assert.equal(result.statusCode, 200); assert.equal(result.body.meta.search_mode, 'keyword_fallback')
})

test('429 does not activate fallback', async () => {
  const controller = createLyricsSearchController({ aiSearch: async () => { const error = new Error('limited'); error.status = 429; error.code = 'RATE_LIMITED'; throw error }, repository: { searchFallback: async () => { throw new Error('must not run') } } })
  const result = response(); await controller({ query: { q: 'three lyric words' } }, result)
  assert.equal(result.statusCode, 429); assert.equal(result.body.error.code, 'RATE_LIMITED')
})

test('fallback normalization and ranking use lyric text only', () => {
  assert.equal(normalizeLyricText('[00:15.20] Thành phố, ngủ!'), 'thanh pho ngu')
  const ranked = rankLyricRows([{ song_id: 2, total_plays: 1, lyrics: 'thanh pho ngu chi con tieng mua' }, { song_id: 1, total_plays: 99, lyrics: 'thanh pho ngu' }, { song_id: 3, total_plays: 999, lyrics: 'unrelated words' }], 'thành phố ngủ')
  assert.deepEqual(ranked.map((item) => item.row.song_id), [1, 2])
})
