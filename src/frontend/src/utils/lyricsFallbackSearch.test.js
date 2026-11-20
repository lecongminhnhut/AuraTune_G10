import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeLyrics, searchLyricsFallback } from './lyricsFallbackSearch.js'

test('normalizes LRC, spacing, punctuation and diacritics', () => assert.equal(normalizeLyrics('[00:01.00] Thành phố, ngủ!'), 'thanh pho ngu'))
test('ranks exact lyric phrases before word matches and ignores metadata', () => {
  const result = searchLyricsFallback([{ id: '2', title: 'target only', artist: 'none', lyrics: 'thanh pho ngu chi con tieng mua', play_count: 1 }, { id: '1', title: 'other', artist: 'other', lyrics: 'thanh pho ngu', play_count: 1 }, { id: '3', title: 'thanh pho ngu', artist: 'target', lyrics: 'not a lyric match', play_count: 999 }], 'thành phố ngủ')
  assert.deepEqual(result.data.map((item) => item.id), ['1', '2'])
})
