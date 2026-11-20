import test from 'node:test'
import assert from 'node:assert/strict'
import { mapLyricsResult } from './aiLyricsSearchApi.js'

test('maps lyric result fields to the existing track view model', () => {
  const result = mapLyricsResult({ id: '1', title: 'Song', artist_id: '2', duration_seconds: 180, play_count: 4, cover_url: '/cover', matched_lyric: 'line' })
  assert.deepEqual(result, { id: '1', title: 'Song', artist_id: '2', duration_seconds: 180, play_count: 4, cover_url: '/cover', matched_lyric: 'line', duration: 180, playCount: 4, artistId: '2', albumId: undefined, releaseDate: undefined, coverArt: '/cover' })
})
