import { lyricsSearchRepository as defaultRepository } from '../repositories/lyricsSearchRepository.js'
import { LyricsAiError, searchLyricsWithAi as defaultAiSearch } from '../services/lyricsAiClient.js'
import { validateLyricQuery } from '../utils/lyricsSearch.js'

const validation = (details) => ({ success: false, message: 'Lyric search query is invalid', data: null, pagination: null, meta: null, error: { code: 'VALIDATION_ERROR', details } })

export function createLyricsSearchController({ repository = defaultRepository, aiSearch = defaultAiSearch } = {}) {
  return async (req, res) => {
    const details = []
    for (const key of Object.keys(req.query)) if (!['q', 'limit', 'offset'].includes(key)) details.push({ field: key, issue: 'Unknown query parameter' })
    const { query, details: queryDetails } = validateLyricQuery(req.query.q)
    details.push(...queryDetails)
    const limit = req.query.limit === undefined ? 20 : Number(req.query.limit)
    const offset = req.query.offset === undefined ? 0 : Number(req.query.offset)
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) details.push({ field: 'limit', issue: 'Must be an integer between 1 and 50' })
    if (!Number.isInteger(offset) || offset < 0) details.push({ field: 'offset', issue: 'Must be a non-negative integer' })
    if (details.length) return res.status(400).json(validation(details))
    const payload = { query, limit, offset }
    try {
      const ai = await aiSearch(payload, { signal: req.signal })
      const mapped = await repository.mapAiResults(ai.data, ai.pagination)
      return res.status(200).json({ success: true, message: ai.message || 'Lyrics search results retrieved', data: mapped.data, pagination: mapped.pagination, meta: { search_mode: 'ai' }, error: null })
    } catch (error) {
      const unavailable = error?.status === 503 || error?.code === 'AI_SERVICE_UNAVAILABLE'
      if (unavailable) {
        try {
          const fallback = await repository.searchFallback(payload)
          return res.status(200).json({ success: true, message: 'Lyrics search results retrieved via keyword fallback', data: fallback.data, pagination: fallback.pagination, meta: { search_mode: 'keyword_fallback' }, error: null })
        } catch (fallbackError) {
          console.error('Lyrics fallback failed:', fallbackError.message)
          return res.status(503).json({ success: false, message: 'Lyric search service is temporarily unavailable, please try again later', data: null, pagination: null, meta: null, error: { code: 'AI_SERVICE_UNAVAILABLE', details: [] } })
        }
      }
      const status = error?.status === 429 ? 429 : error?.status === 400 ? 400 : 500
      const code = status === 429 ? 'RATE_LIMITED' : status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR'
      const message = status === 429 ? 'Too many requests, please try again later' : status === 400 ? (error.message || 'Lyric search query is invalid') : 'An internal error occurred while searching lyrics'
      return res.status(status).json({ success: false, message, data: null, pagination: null, meta: null, error: { code, details: error.details || [] } })
    }
  }
}

export const lyricsSearchController = createLyricsSearchController()
