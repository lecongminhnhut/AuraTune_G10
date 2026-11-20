import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AgentRunEntry } from '../../src/components/chat/AIHostChat.jsx'

describe('AIHostChatRetry (T026 - US3 Retry & Degradation - FR-009)', () => {
  test('AgentRunEntry renders inline error and clickable "Thử lại" button with retryPrompt', () => {
    const errorRun = {
      id: 'run-1',
      kind: 'run',
      status: 'error',
      startedAt: Date.now() - 2000,
      endedAt: Date.now(),
      thinkingEndedAt: Date.now() - 1500,
      thinking: ['Đang kết nối...'],
      items: [],
      text: '',
      error: 'Lỗi kết nối đến AI Host',
      retryPrompt: 'phát nhạc chill lofi'
    }

    let retryCalledWith = null
    const onRetry = (prompt) => {
      retryCalledWith = prompt
    }

    const html = renderToStaticMarkup(
      <AgentRunEntry
        run={errorRun}
        now={Date.now()}
        onRetry={onRetry}
        store={{ findPlaylistById: () => null }}
      />
    )

    assert.ok(html.includes('✗ Lỗi kết nối đến AI Host'), 'Should render inline failure text')
    assert.ok(html.includes('Thử lại'), 'Should render Thử lại button')

    // Simulate clicking Thử lại with preserved prompt
    onRetry(errorRun.retryPrompt)
    assert.equal(retryCalledWith, 'phát nhạc chill lofi', 'Should pass exact original prompt to onRetry')
  })

  test('AgentRunEntry displays completed state when done', () => {
    const doneRun = {
      id: 'run-2',
      kind: 'run',
      status: 'done',
      startedAt: Date.now() - 3200,
      endedAt: Date.now(),
      thinkingEndedAt: Date.now() - 2000,
      thinking: ['Đang đọc bài hát...'],
      items: [],
      text: 'Bài hát đang phát là **Em Của Ngày Hôm Qua**.',
      error: null
    }

    const html = renderToStaticMarkup(
      <AgentRunEntry
        run={doneRun}
        now={Date.now()}
        store={{ findPlaylistById: () => null }}
      />
    )

    assert.ok(html.includes('✓ xong trong 3.2s'), 'Should render completed badge with duration')
    assert.ok(html.includes('Em Của Ngày Hôm Qua'), 'Should render markdown response')
  })
})
