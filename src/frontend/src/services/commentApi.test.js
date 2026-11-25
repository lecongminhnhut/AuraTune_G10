import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { CommentApiError, createCommentApi, fromApiComment } from './commentApi.js'
import { fetchSongLyrics, isCatalogSongId } from './songApi.js'

// Feature 046 comments client and Feature 044 (T031) lyrics client.

const jsonResponse = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body })

function fakeFetch(responses) {
  const calls = []
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, ...options })
    const next = responses.shift()
    if (next instanceof Error) throw next
    return next
  }
  return { calls, fetchImpl }
}

const apiComment = { id: '5', song_id: '17', content: 'Hay quá', created_at: '2026-11-25T01:00:00.000Z', author: { id: 'u1', name: 'Minh Anh', avatar_url: null }, can_delete: true }

describe('commentApi', () => {
  test('list maps comments and has_more', async () => {
    const { calls, fetchImpl } = fakeFetch([jsonResponse(200, { success: true, data: [apiComment], pagination: { has_more: true } })])
    const result = await createCommentApi(fetchImpl).list('17', { limit: 20 })
    assert.equal(calls[0].url, '/songs/17/comments?limit=20')
    assert.deepEqual(result, {
      comments: [{ id: '5', userId: 'u1', author: 'Minh Anh', avatarUrl: null, text: 'Hay quá', createdAt: '2026-11-25T01:00:00.000Z', canDelete: true }],
      hasMore: true,
    })
  })

  test('create posts the content and returns the new comment', async () => {
    const { calls, fetchImpl } = fakeFetch([jsonResponse(201, { success: true, data: apiComment })])
    const comment = await createCommentApi(fetchImpl).create('17', 'Hay quá')
    assert.equal(calls[0].method, 'POST')
    assert.equal(calls[0].url, '/songs/17/comments')
    assert.deepEqual(JSON.parse(calls[0].body), { content: 'Hay quá' })
    assert.equal(comment.text, 'Hay quá')
  })

  test('remove sends DELETE /comments/:id', async () => {
    const { calls, fetchImpl } = fakeFetch([jsonResponse(200, { success: true, data: { id: '5' } })])
    assert.equal(await createCommentApi(fetchImpl).remove('5'), true)
    assert.deepEqual([calls[0].method, calls[0].url], ['DELETE', '/comments/5'])
  })

  test('errors carry the status, code and a readable message', async () => {
    const api = (response) => createCommentApi(fakeFetch([response]).fetchImpl)
    await assert.rejects(api(jsonResponse(403, { success: false, error: 'forbidden', message: 'Bạn chỉ có thể xóa bình luận của mình.' })).remove('5'),
      (error) => error instanceof CommentApiError && error.status === 403 && error.code === 'forbidden' && /chỉ có thể xóa/.test(error.message))
    await assert.rejects(api(jsonResponse(401, { success: false, message: 'Authentication is required.' })).create('17', 'x'),
      (error) => error.status === 401 && /đăng nhập lại/.test(error.message))
    await assert.rejects(api(jsonResponse(503, null)).list('17'), (error) => error.status === 503 && /tạm thời không khả dụng/.test(error.message))
    await assert.rejects(api(new TypeError('Failed to fetch')).list('17'), (error) => error.status === 0 && /Không kết nối/.test(error.message))
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' })
    await assert.rejects(api(abort).list('17'), (error) => error.name === 'AbortError')
  })

  test('fromApiComment falls back to a generic author name', () => {
    assert.equal(fromApiComment({ ...apiComment, author: null }).author, 'Người nghe AuraTune')
  })
})

describe('lyrics client', () => {
  test('isCatalogSongId', () => {
    assert.equal(isCatalogSongId('17'), true)
    assert.equal(isCatalogSongId(17), true)
    assert.equal(isCatalogSongId('t1'), false)
    assert.equal(isCatalogSongId(''), false)
    assert.equal(isCatalogSongId(null), false)
  })

  test('fetchSongLyrics returns synced and plain lyrics', async () => {
    const { calls, fetchImpl } = fakeFetch([jsonResponse(200, { success: true, data: { song_id: '17', has_lyrics: true, synced: [{ time: 1, text: 'a' }], plain: null } })])
    assert.deepEqual(await fetchSongLyrics('17', { fetchImpl }), { synced: [{ time: 1, text: 'a' }], plain: null })
    assert.match(calls[0].url, /\/songs\/17\/lyrics$/)
  })

  test('fetchSongLyrics throws with the status when the request fails', async () => {
    const { fetchImpl } = fakeFetch([jsonResponse(404, { success: false, message: 'Không tìm thấy bài hát.' })])
    await assert.rejects(fetchSongLyrics('17', { fetchImpl }), (error) => error.status === 404 && error.message === 'Không tìm thấy bài hát.')
  })
})
