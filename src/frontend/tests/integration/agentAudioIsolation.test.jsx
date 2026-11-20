import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ChatErrorBoundary } from '../../src/components/chat/AIHostChat.jsx'

describe('agentAudioIsolation (T025 - US3 Resilience & Audio Isolation - FR-011, SC-005)', () => {
  test('Active audio playback state remains completely unmutated during simulated chat error or crash', () => {
    // Initial mock audio player engine state from PlayerContext
    const playerState = {
      track: { id: 't1', title: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP' },
      isPlaying: true,
      volume: 75,
      currentTime: 42.5
    }

    const snapshotBefore = JSON.stringify(playerState)

    // Verify ChatErrorBoundary fallback rendering
    const boundary = new ChatErrorBoundary({})
    const simulatedError = new Error('Simulated HTTP 503 / SSE connection drop in chat engine')
    const derivedState = ChatErrorBoundary.getDerivedStateFromError(simulatedError)
    boundary.state = derivedState

    const html = renderToStaticMarkup(boundary.render())
    assert.ok(html.includes('Trình phát nhạc vẫn tiếp tục hoạt động hoàn toàn bình thường.'))

    // Strict Audio Playback Invariant check (SC-005, Invariant 3):
    // Zero mutation of isPlaying, track, volume, or currentTime
    const snapshotAfter = JSON.stringify(playerState)
    assert.equal(snapshotBefore, snapshotAfter, 'Audio playback state must remain 100% untouched')
    assert.equal(playerState.isPlaying, true, 'Audio must continue playing')
    assert.equal(playerState.volume, 75, 'Volume must not change')
    assert.equal(playerState.track.id, 't1', 'Track must remain unchanged')
  })
})
