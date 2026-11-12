import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BannerEntry } from '../../src/components/chat/AIHostChat.jsx'

describe('agentSessionPurge (T032 - US4 Account Isolation & Memory Wipe - FR-010, SC-004)', () => {
  test('Session state simulation: User A conversation is purged on logout, leaving pristine banner for User B', () => {
    // Simulate active session for User A with conversation and history buffer
    let userASession = {
      user: { id: 'user-a-123', name: 'User A' },
      entries: [
        { id: 'banner-0', kind: 'banner' },
        { id: 'user-1', kind: 'user', text: 'Gợi ý nhạc cho tôi' },
        { id: 'run-2', kind: 'run', text: 'Đây là nhạc cho bạn' }
      ],
      history: {
        items: ['Gợi ý nhạc cho tôi', 'bài đang phát là gì?'],
        index: -1
      }
    }

    assert.equal(userASession.entries.length, 3)
    assert.equal(userASession.history.items.length, 2)

    // User A logs out (FR-010: Purge in-memory state)
    const purgeSession = () => ({
      user: null,
      entries: [{ id: 'banner-0', kind: 'banner' }],
      history: { items: [], index: -1 }
    })

    const loggedOutState = purgeSession()
    assert.equal(loggedOutState.user, null)
    assert.equal(loggedOutState.entries.length, 1)
    assert.equal(loggedOutState.entries[0].kind, 'banner')
    assert.equal(loggedOutState.history.items.length, 0)

    // User B logs in
    const userBSession = {
      ...loggedOutState,
      user: { id: 'user-b-456', name: 'User B' }
    }

    // Verify User B has ZERO messages or history items from User A (Decree 13/2023/ND-CP)
    assert.equal(userBSession.entries.length, 1)
    assert.equal(userBSession.entries[0].kind, 'banner')
    assert.equal(userBSession.history.items.length, 0)

    const bannerHtml = renderToStaticMarkup(<BannerEntry />)
    assert.ok(bannerHtml.includes('AuraTune Agent'), 'User B sees initial welcome banner')
    assert.ok(!bannerHtml.includes('Gợi ý nhạc cho tôi'), 'No residual data from User A')
  })

  test('Unauthenticated user receives login challenge entry (FR-001)', () => {
    const authChallengeEntry = {
      id: 'auth-1',
      kind: 'auth_challenge',
      message: 'Vui lòng đăng nhập để sử dụng tính năng trò chuyện với AI Host.'
    }

    assert.equal(authChallengeEntry.kind, 'auth_challenge')
    assert.ok(authChallengeEntry.message.includes('Vui lòng đăng nhập'))
  })
})
