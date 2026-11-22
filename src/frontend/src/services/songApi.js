import { API_BASE_URL } from './sessionApiClient.js'

// Địa chỉ luồng âm thanh của bài hát (Group 040). Bài đã có audioUrl riêng (ví dụ tệp do
// nghệ sĩ tải lên kho media) dùng thẳng địa chỉ đó; còn lại phát qua endpoint stream của backend.
export const songStreamUrl = (trackId) => `${API_BASE_URL}/songs/${encodeURIComponent(trackId)}/stream`

export const trackAudioUrl = (track) => track.audioUrl || songStreamUrl(track.id)

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
