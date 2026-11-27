import { apiFetch } from './sessionApiClient.js'

// Group 040 (041-FR-014): play events stored by the backend in Supabase `listening_history`.

export class HistoryApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.name = 'HistoryApiError'
    this.status = status
    this.code = code
  }
}

async function request(path, options = {}) {
  const response = await apiFetch(`/users/me/history${path}`, options)
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.success === false) {
    throw new HistoryApiError(payload?.message || 'Không kết nối được dịch vụ lịch sử nghe.', {
      status: response.status,
      code: typeof payload?.error === 'string' ? payload.error : payload?.error?.code,
    })
  }
  return payload
}

export const historyApi = {
  list: async (limit = 200) => (await request(`?limit=${limit}`))?.data,
  listPage: async ({ limit = 50, cursor = null } = {}) => {
    const query = new URLSearchParams({ limit: String(limit) })
    if (cursor) query.set('cursor', cursor)
    const payload = await request(`?${query}`)
    return { entries: payload?.data || [], nextCursor: payload?.nextCursor || null }
  },
  record: async (songId, listenedSeconds = 0) => (await request('', {
    method: 'POST',
    body: JSON.stringify({ songId: String(songId), listenedSeconds: Math.max(0, Math.round(listenedSeconds)) }),
  }))?.data,
  // keepalive lets the last update finish when it is sent from `pagehide`.
  updateListened: async (entryId, listenedSeconds) => (await request(`/${encodeURIComponent(entryId)}`, {
    method: 'PATCH',
    keepalive: true,
    body: JSON.stringify({ listenedSeconds: Math.max(0, Math.round(listenedSeconds)) }),
  }))?.data,
  clear: async () => (await request('', { method: 'DELETE' }))?.data,
}

// Maps an API entry to the shape the History, Home and Recommendation views already use.
export const fromApiHistoryEntry = (entry) => ({
  id: String(entry.id),
  trackId: String(entry.song_id),
  playedAt: entry.played_at,
  listened: Number(entry.listened_duration) || 0,
})

export default historyApi
