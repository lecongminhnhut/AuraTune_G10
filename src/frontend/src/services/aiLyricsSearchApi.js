const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000'
const allowedParameters = ['q', 'limit', 'offset']

export class LyricsSearchApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details = [] } = {}) {
    super(message); this.name = 'LyricsSearchApiError'; this.status = status; this.code = code; this.details = details
  }
}

export function mapLyricsResult(item) {
  return { ...item, duration: item.duration_seconds, playCount: item.play_count, artistId: item.artist_id, albumId: item.album_id, releaseDate: item.release_date, coverArt: item.cover_url }
}

export async function searchLyrics(parameters, { signal, fetchImpl = fetch } = {}) {
  const query = new URLSearchParams()
  for (const key of allowedParameters) if (parameters[key] !== undefined && parameters[key] !== '') query.set(key, parameters[key])
  let response
  try { response = await fetchImpl(`${API_BASE_URL}/api/v1/search/lyrics?${query.toString()}`, { signal, headers: { Accept: 'application/json' } }) } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new LyricsSearchApiError('Lyrics search service is unavailable.', { code: 'AI_SERVICE_UNAVAILABLE', status: 503 })
  }
  let body
  try { body = await response.json() } catch { throw new LyricsSearchApiError('Search service returned an invalid response.', { status: response.status, code: 'INTERNAL_ERROR' }) }
  if (!response.ok || body.success === false) throw new LyricsSearchApiError(body.message || 'Lyrics search request failed.', { status: response.status, code: body.error?.code || 'INTERNAL_ERROR', details: body.error?.details || [] })
  return { ...body, data: (body.data || []).map(mapLyricsResult) }
}
