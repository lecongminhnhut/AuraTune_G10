const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000'

export class SemanticSearchError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details = [] } = {}) { super(message); this.name = 'SemanticSearchError'; this.status = status; this.code = code; this.details = details }
}

export function mapSemanticResult(item) {
  return { ...item, duration: item.duration_seconds, playCount: item.play_count, artistId: item.artist_id, albumId: item.album_id, coverArt: item.cover_url }
}

export async function searchSemantic({ q, limit = 20, offset = 0, token } = {}, { signal, fetchImpl = fetch } = {}) {
  const params = new URLSearchParams({ q, mode: 'semantic', limit: String(limit), offset: String(offset) })
  let response
  try { response = await fetchImpl(`${API_BASE_URL}/api/v1/search?${params}`, { signal, headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } }) } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new SemanticSearchError('Semantic search is unavailable.', { status: 503, code: 'AI_SERVICE_UNAVAILABLE' })
  }
  let body; try { body = await response.json() } catch { throw new SemanticSearchError('Search service returned an invalid response.', { status: response.status, code: 'INTERNAL_ERROR' }) }
  if (!response.ok || body.success === false) throw new SemanticSearchError(body.message || 'Semantic search failed.', { status: response.status, code: body.error?.code || 'INTERNAL_ERROR', details: body.error?.details || [] })
  return { ...body, data: (body.data || []).map(mapSemanticResult) }
}
