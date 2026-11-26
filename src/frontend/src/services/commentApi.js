import { apiFetch } from './sessionApiClient.js'

// Group 040, Feature 046: song comments stored by the backend in Supabase `song_comments`.
// Reading is public; apiFetch adds the access token when the listener is signed in, so the
// response also tells which comments the viewer may delete.

export const MAX_COMMENT_LENGTH = 300

export class CommentApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.name = 'CommentApiError'
    this.status = status
    this.code = code
  }
}

const fallbackMessages = {
  401: 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại để bình luận.',
  403: 'Bạn chỉ có thể xóa bình luận của mình.',
  503: 'Bình luận tạm thời không khả dụng. Vui lòng thử lại sau.',
}

export function createCommentApi(fetchImpl = apiFetch) {
  async function request(path, options = {}) {
    let response
    try {
      response = await fetchImpl(path, options)
    } catch (error) {
      if (error?.name === 'AbortError') throw error
      throw new CommentApiError('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.', { status: 0 })
    }
    const payload = await response.json().catch(() => null)
    if (!response.ok || payload?.success === false) {
      throw new CommentApiError(
        (response.status === 401 && fallbackMessages[401]) || payload?.message || fallbackMessages[response.status] || 'Không xử lý được bình luận, vui lòng thử lại.',
        { status: response.status, code: typeof payload?.error === 'string' ? payload.error : payload?.error?.code },
      )
    }
    return payload
  }

  return {
    async list(songId, { limit = 50, signal } = {}) {
      const payload = await request(`/songs/${encodeURIComponent(songId)}/comments?limit=${limit}`, { signal })
      return { comments: (payload.data ?? []).map(fromApiComment), hasMore: Boolean(payload.pagination?.has_more) }
    },
    async create(songId, content) {
      const payload = await request(`/songs/${encodeURIComponent(songId)}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      return fromApiComment(payload.data)
    },
    async remove(commentId) {
      await request(`/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE' })
      return true
    },
  }
}

// Maps an API comment to the shape the comments panel renders.
export const fromApiComment = (comment) => ({
  id: String(comment.id),
  userId: String(comment.author?.id ?? ''),
  author: comment.author?.name || 'Người nghe AuraTune',
  avatarUrl: comment.author?.avatar_url ?? null,
  text: comment.content ?? '',
  createdAt: comment.created_at,
  canDelete: Boolean(comment.can_delete),
})

export const commentApi = createCommentApi()

export default commentApi
