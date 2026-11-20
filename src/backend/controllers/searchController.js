import { searchRepository as defaultRepository } from '../repositories/searchRepository.js'
import { createSemanticSearchOrchestrator } from '../services/semanticSearchOrchestrator.js'
import { loadSemanticProfile } from '../services/semanticProfileLoader.js'

const allowed = new Set(['q', 'mode', 'type', 'limit', 'offset', 'genre', 'release_year', 'sort'])
const types = new Set(['all', 'tracks', 'artists', 'albums', 'playlists'])
const sorts = new Set(['relevance', 'plays', 'newest', 'title'])

const validation = (details) => ({ success: false, message: 'Search query is invalid', data: null, error: { code: 'VALIDATION_ERROR', details } })

export function createSearchController(repository = defaultRepository, semanticSearch = createSemanticSearchOrchestrator()) {
  return async (req, res) => {
    if (req.query.mode === 'semantic') {
      const allowedSemantic = new Set(['q', 'mode', 'limit', 'offset'])
      const details = Object.keys(req.query).filter((key) => !allowedSemantic.has(key)).map((field) => ({ field, issue: 'Unknown query parameter' }))
      const limit = req.query.limit === undefined ? 20 : Number(req.query.limit)
      const offset = req.query.offset === undefined ? 0 : Number(req.query.offset)
      if (!Number.isInteger(limit) || limit < 1 || limit > 50) details.push({ field: 'limit', issue: 'Must be an integer between 1 and 50' })
      if (!Number.isInteger(offset) || offset < 0) details.push({ field: 'offset', issue: 'Must be a non-negative integer' })
      const q = typeof req.query.q === 'string' ? req.query.q : ''
      const validationQuery = String(q).trim()
      if (!validationQuery || validationQuery.length > 150 || !/[\p{L}\p{N}]/u.test(validationQuery)) details.push({ field: 'q', issue: 'Must contain at least one meaningful alphanumeric token and be 150 characters or fewer after trimming' })
      if (details.length) return res.status(400).json({ success: false, message: 'Semantic search query is invalid', data: null, pagination: null, meta: null, error: { code: 'VALIDATION_ERROR', details } })
      try {
        const result = await semanticSearch({ q, limit, offset, profile: await loadSemanticProfile(req), signal: req.signal })
        return res.status(200).json({ success: true, message: result.message, data: result.data, pagination: result.pagination, meta: result.meta, error: null })
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Semantic search is unavailable', data: null, pagination: null, meta: null, error: { code: error.code || 'INTERNAL_ERROR', details: [] } })
      }
    }
    const details = []
    const mode = req.query.mode || 'metadata'
    if (mode !== 'metadata') details.push({ field: 'mode', issue: 'Must be metadata or semantic' })
    for (const key of Object.keys(req.query)) if (!allowed.has(key)) details.push({ field: key, issue: 'Unknown query parameter' })
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    if (q.length < 2 || q.length > 100) details.push({ field: 'q', issue: 'Must contain between 2 and 100 characters after trimming' })
    const type = req.query.type || 'all'
    if (!types.has(type)) details.push({ field: 'type', issue: 'Must be one of all, tracks, artists, albums, playlists' })
    const limit = req.query.limit === undefined ? 20 : Number(req.query.limit)
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) details.push({ field: 'limit', issue: 'Must be an integer between 1 and 50' })
    const offset = req.query.offset === undefined ? 0 : Number(req.query.offset)
    if (!Number.isInteger(offset) || offset < 0) details.push({ field: 'offset', issue: 'Must be a non-negative integer' })
    const releaseYear = req.query.release_year === undefined ? undefined : Number(req.query.release_year)
    if (req.query.release_year !== undefined && (!Number.isInteger(releaseYear) || releaseYear < 1000 || releaseYear > 9999)) details.push({ field: 'release_year', issue: 'Must be a four-digit calendar year' })
    const sort = req.query.sort || 'relevance'
    if (!sorts.has(sort)) details.push({ field: 'sort', issue: 'Must be one of relevance, plays, newest, title' })
    if ((req.query.genre !== undefined || req.query.release_year !== undefined) && !['all', 'tracks', 'albums'].includes(type)) details.push({ field: type, issue: 'genre and release_year apply only to all, tracks, and albums' })
    if (sort === 'plays' && !['all', 'tracks'].includes(type)) details.push({ field: 'sort', issue: 'plays applies only to all and tracks' })
    if (sort === 'newest' && !['all', 'tracks', 'albums'].includes(type)) details.push({ field: 'sort', issue: 'newest applies only to all, tracks, and albums' })
    if (details.length) return res.status(400).json(validation(details))
    try {
      const result = await repository.search({ q, type, limit, offset, genre: req.query.genre, release_year: releaseYear, sort })
      return res.status(200).json({ success: true, message: 'Search results retrieved', data: result.data, pagination: result.pagination, error: null })
    } catch (error) {
      console.error('Metadata search failed:', error.message)
      return res.status(500).json({ success: false, message: 'Search service is unavailable', data: null, error: { code: 'INTERNAL_ERROR', details: [] } })
    }
  }
}

export const searchController = createSearchController()
