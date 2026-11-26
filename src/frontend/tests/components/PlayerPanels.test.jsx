import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import CommentThread from '../../src/components/player/CommentThread.jsx'
import LyricsPanel from '../../src/components/player/LyricsPanel.jsx'

// Group 040: comment thread (Feature 046) and lyrics loading states (Feature 044, T031).

// loginPath() reads the current address for the "next" parameter.
globalThis.window ??= { location: { pathname: '/', search: '' } }

const now = Date.parse('2026-11-25T12:00:00Z')
const comments = [
  { id: '2', author: 'Linh', text: 'Mới nhất', createdAt: new Date(now - 60000 * 3).toISOString(), canDelete: true },
  { id: '1', author: 'Minh Anh', text: 'Cũ hơn', createdAt: new Date(now - 86400000).toISOString(), canDelete: false },
]
const render = (props) => renderToStaticMarkup(
  <CommentThread title="Glad" comments={[]} signedIn={false} canPost={false} onSubmit={async () => null} onDelete={() => {}} now={now} {...props} />,
)

describe('CommentThread (Feature 046)', () => {
  test('guests read comments and see a sign-in prompt instead of the input (FR-006, FR-015)', () => {
    const html = render({ comments })
    assert.match(html, /Mới nhất[\s\S]*Cũ hơn/, 'newest first, as given')
    assert.match(html, /3 phút trước/)
    assert.match(html, /1 ngày trước/)
    assert.match(html, /Đăng nhập<\/a> để bình luận/)
    assert.doesNotMatch(html, /Viết bình luận/)
  })

  test('only comments the viewer may delete show the delete action (FR-011)', () => {
    const html = render({ comments, signedIn: true, canPost: true })
    assert.equal(html.match(/aria-label="Xóa bình luận"/g)?.length, 1)
    assert.match(html, /aria-label="Viết bình luận"/)
    assert.match(html, /maxLength="300"/)
  })

  test('a signed-in account that cannot post here is told to use an AuraTune account', () => {
    assert.match(render({ signedIn: true, canPost: false }), /bằng tài khoản AuraTune để bình luận/)
  })

  test('empty, loading and error states (FR-014)', () => {
    assert.match(render({ status: 'ready' }), /Chưa có bình luận nào/)
    const loading = render({ status: 'loading' })
    assert.match(loading, /Đang tải bình luận/)
    assert.doesNotMatch(loading, /Chưa có bình luận nào/)
    const error = render({ status: 'error', error: 'Bình luận tạm thời không khả dụng.', onRetry: () => {} })
    assert.match(error, /role="alert"/)
    assert.match(error, /Bình luận tạm thời không khả dụng\./)
    assert.match(error, /Thử lại/)
  })

  test('long words wrap inside the panel', () => {
    assert.match(render({ comments: [{ ...comments[0], text: 'a'.repeat(300) }] }), /overflow-wrap:anywhere/)
  })
})

describe('LyricsPanel states (T031)', () => {
  const track = { id: '17', title: 'Glad', lyrics: [], plainLyrics: null }
  test('loading and error', () => {
    assert.match(renderToStaticMarkup(<LyricsPanel track={track} elapsed={0} onSeekLine={() => {}} status="loading" />), /Đang tải lời bài hát/)
    const error = renderToStaticMarkup(<LyricsPanel track={track} elapsed={0} onSeekLine={() => {}} status="error" onRetry={() => {}} />)
    assert.match(error, /Không tải được lời bài hát/)
    assert.match(error, /Thử lại/)
  })

  test('lyrics from the API: synced lines, plain text, or the no-lyrics notice', () => {
    const synced = renderToStaticMarkup(<LyricsPanel track={{ ...track, lyrics: [{ time: 0, text: 'Dòng một' }, { time: 5, text: 'Dòng hai' }] }} elapsed={6} onSeekLine={() => {}} />)
    assert.match(synced, /aria-current="true"[^>]*>Dòng hai/)
    assert.match(renderToStaticMarkup(<LyricsPanel track={{ ...track, plainLyrics: 'Lời thường' }} elapsed={0} onSeekLine={() => {}} />), /Lời thường/)
    assert.match(renderToStaticMarkup(<LyricsPanel track={track} elapsed={0} onSeekLine={() => {}} />), /Bài hát này chưa có lời/)
  })
})
