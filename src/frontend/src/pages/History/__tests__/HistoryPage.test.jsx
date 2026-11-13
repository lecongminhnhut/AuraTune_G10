import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import HistoryPage from '../HistoryPage.jsx'
import { getMockListeningAnalysis, formatDuration } from '../../../services/mock/mockStatsService.js'

describe('HistoryPage & Listening Analysis Component Tests (T028 - Polish)', () => {
  describe('Mock Stats Service Integration (US1 & US2)', () => {
    test('formats seconds into Vietnamese duration string', () => {
      assert.equal(formatDuration(0), '0 phút')
      assert.equal(formatDuration(45), '1 phút')
      assert.equal(formatDuration(3660), '1 giờ 1 phút')
      assert.equal(formatDuration(48250), '13 giờ 24 phút')
    })

    test('returns hasSufficientData: false when history is empty', () => {
      const res = getMockListeningAnalysis('all', { history: [] })
      assert.equal(res.success, true)
      assert.equal(res.data.hasSufficientData, false)
      assert.equal(res.data.totalDurationSeconds, 0)
      assert.equal(res.data.formattedTotalDuration, '0 phút')
      assert.deepEqual(res.data.topGenres, [])
    })

    test('calculates accurate duration and top genres sorted by accumulatedSeconds DESC', () => {
      const now = new Date().toISOString()
      const sampleHistory = [
        { id: '1', trackId: 't1', listened: 261, playedAt: now }, // t1: ballad (261s)
        { id: '2', trackId: 't8', listened: 204, playedAt: now }, // t8: lofi (204s)
        { id: '3', trackId: 't9', listened: 178, playedAt: now }, // t9: lofi (178s) -> lofi total 382s
      ]

      const res = getMockListeningAnalysis('all', { history: sampleHistory })
      assert.equal(res.success, true)
      assert.equal(res.data.hasSufficientData, true)
      assert.equal(res.data.totalDurationSeconds, 643) // 261 + 204 + 178
      assert.equal(res.data.totalPlays, 3)
      assert.equal(res.data.uniqueTracksCount, 3)

      // Top genre should be Lo-Fi (382s), followed by Ballad (261s)
      assert.equal(res.data.topGenres[0].genreId, 'lofi')
      assert.equal(res.data.topGenres[0].accumulatedSeconds, 382)
      assert.equal(res.data.topGenres[0].rank, 1)

      assert.equal(res.data.topGenres[1].genreId, 'ballad')
      assert.equal(res.data.topGenres[1].accumulatedSeconds, 261)
      assert.equal(res.data.topGenres[1].rank, 2)
    })

    test('filters playback events by time range (7, 30, all)', () => {
      const now = Date.now()
      const sampleHistory = [
        { id: '1', trackId: 't1', listened: 100, playedAt: new Date(now - 2 * 86400000).toISOString() }, // 2 days ago
        { id: '2', trackId: 't8', listened: 200, playedAt: new Date(now - 15 * 86400000).toISOString() }, // 15 days ago
        { id: '3', trackId: 't9', listened: 300, playedAt: new Date(now - 45 * 86400000).toISOString() }, // 45 days ago
      ]

      const res7 = getMockListeningAnalysis('7', { history: sampleHistory })
      assert.equal(res7.data.totalDurationSeconds, 100)
      assert.equal(res7.data.totalPlays, 1)

      const res30 = getMockListeningAnalysis('30', { history: sampleHistory })
      assert.equal(res30.data.totalDurationSeconds, 300) // 100 + 200
      assert.equal(res30.data.totalPlays, 2)

      const resAll = getMockListeningAnalysis('all', { history: sampleHistory })
      assert.equal(resAll.data.totalDurationSeconds, 600) // 100 + 200 + 300
      assert.equal(resAll.data.totalPlays, 3)
    })
  })

  describe('Domain Boundary Verification (FR-004, FR-011)', () => {
    test('HistoryPage module does not export or compute Top Artists and Top Songs belonging to Group 070', () => {
      // Inspect component definition
      assert.equal(typeof HistoryPage, 'function')
      // Ensure no leakage in component exports
      assert.equal(HistoryPage.topArtists, undefined)
      assert.equal(HistoryPage.topTracks, undefined)
    })
  })
})
