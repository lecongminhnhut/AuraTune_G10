import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  BannerEntry,
  HelpEntry,
  HELP_LINES,
  SUGGESTIONS,
  formatDurationSeconds,
  ChatErrorBoundary
} from '../../src/components/chat/AIHostChat.jsx'

describe('AIHostChatOpen - US1 Start & View Conversation (T009)', () => {
  test('BannerEntry renders pristine welcome banner and intro bullets (SC-001)', () => {
    const html = renderToStaticMarkup(<BannerEntry />)
    assert.ok(html.includes('Chào mừng đến với'), 'Banner should display welcome title')
    assert.ok(html.includes('AuraTune Agent'), 'Banner should mention AuraTune Agent')
    assert.ok(html.includes('phát nhạc chill rồi giảm âm lượng'), 'Banner should include starter suggestions')
    assert.ok(html.includes('/help để xem phím tắt'), 'Banner should point to /help shortcut')
  })

  test('HelpEntry renders offline cheat sheet table', () => {
    const html = renderToStaticMarkup(<HelpEntry />)
    for (const [key, desc] of HELP_LINES) {
      assert.ok(html.includes(key), `Help should contain key ${key}`)
      assert.ok(html.includes(desc), `Help should contain description ${desc}`)
    }
  })

  test('SUGGESTIONS contains essential quick starter prompts', () => {
    assert.ok(SUGGESTIONS.length >= 4, 'Expected at least 4 suggestion chips')
    assert.ok(SUGGESTIONS.includes('bài đang phát là gì?'))
    assert.ok(SUGGESTIONS.includes('phát lofi chill để code'))
  })

  test('formatDurationSeconds formats ms accurately', () => {
    assert.equal(formatDurationSeconds(0), '0.0s')
    assert.equal(formatDurationSeconds(1250), '1.3s')
    assert.equal(formatDurationSeconds(5000), '5.0s')
  })

  test('ChatErrorBoundary state handles error condition gracefully', () => {
    const boundary = new ChatErrorBoundary({})
    boundary.state = { hasError: true, error: new Error('Simulated chat UI render crash') }
    const html = renderToStaticMarkup(boundary.render())
    assert.ok(html.includes('Giao diện AI Host gặp sự cố kết xuất.'), 'Should render error boundary fallback')
    assert.ok(html.includes('Trình phát nhạc vẫn tiếp tục hoạt động hoàn toàn bình thường.'), 'Should inform audio isolation')
  })
})
