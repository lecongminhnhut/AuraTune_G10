import { API_BASE_URL } from './sessionApiClient.js'
const allowedParameters = ['q', 'type', 'limit', 'offset', 'genre', 'release_year', 'sort']

export class SearchApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details = [] } = {}) {
    super(message)
    this.name = 'SearchApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export async function searchMetadata(parameters, { signal } = {}) {
  const query = new URLSearchParams()
  for (const key of allowedParameters) if (parameters[key] !== undefined && parameters[key] !== '') query.set(key, parameters[key])
  let response
  try {
    response = await fetch(`${API_BASE_URL}/search?${query.toString()}`, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new SearchApiError('Search service is unavailable.', { code: 'NETWORK_ERROR' })
  }
  let body
  try { body = await response.json() } catch { throw new SearchApiError('Search service returned an invalid response.', { status: response.status, code: 'INTERNAL_ERROR' }) }
  if (!response.ok || body.success === false) throw new SearchApiError(body.message || 'Search request failed.', { status: response.status, code: body.error?.code || 'INTERNAL_ERROR', details: body.error?.details || [] })
  return body
}
