import { API_BASE_URL } from './sessionApiClient.js'

// Địa chỉ luồng âm thanh của bài hát (Group 040). Bài đã có audioUrl riêng (ví dụ tệp do
// nghệ sĩ tải lên kho media) dùng thẳng địa chỉ đó; còn lại phát qua endpoint stream của backend.
export const songStreamUrl = (trackId) => `${API_BASE_URL}/songs/${encodeURIComponent(trackId)}/stream`

export const trackAudioUrl = (track) => track.audioUrl || songStreamUrl(track.id)

export async function fetchCatalogSongs({ signal, fetchImpl = fetch } = {}) {
  const response = await fetchImpl(`${API_BASE_URL}/songs?limit=200`, { signal, headers: { Accept: 'application/json' } })
  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
    throw new Error(payload?.message || 'Không tải được kho nhạc.')
  }
  return payload.data
}

// Metadata of one catalog song (GET /api/v1/songs/:id); null when it cannot be loaded.
export async function fetchSongMetadata(songId) {
  try {
    const response = await fetch(`${API_BASE_URL}/songs/${encodeURIComponent(songId)}`)
    if (!response.ok) return null
    const payload = await response.json()
    return payload?.success ? payload.data : null
  } catch {
    return null
  }
}

// Songs of the Supabase catalog have numeric ids; demo tracks (t1…t10) keep their data in the app.
export const isCatalogSongId = (id) => /^\d{1,18}$/.test(String(id ?? ''))

// Feature 044 (T031): lyrics of one catalog song (GET /api/v1/songs/:id/lyrics).
// Resolves to { synced: [{ time, text }], plain: string | null }; throws when the request fails.
export async function fetchSongLyrics(songId, { signal, fetchImpl = fetch } = {}) {
  const response = await fetchImpl(`${API_BASE_URL}/songs/${encodeURIComponent(songId)}/lyrics`, { signal })
  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.success) {
    const error = new Error(payload?.message || 'Không tải được lời bài hát.')
    error.status = response.status
    throw error
  }
  return {
    synced: Array.isArray(payload.data?.synced) ? payload.data.synced : [],
    plain: typeof payload.data?.plain === 'string' ? payload.data.plain : null,
  }
}
