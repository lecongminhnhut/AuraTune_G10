import { validateSemanticQuery } from '../utils/semanticQuery.js'
import { createSemanticPrivacyGuard } from './semanticPrivacyGuard.js'
import { deduplicateSemanticResults } from './semanticRanking.js'
import { createSemanticCatalogRepository } from './semanticCatalogRepository.js'
import { searchSemanticWithAi as defaultAiSearch } from './semanticAiClient.js'

export class SemanticSearchError extends Error { constructor(message, code = 'INTERNAL_ERROR') { super(message); this.code = code } }

export function createSemanticSearchOrchestrator({ catalog = createSemanticCatalogRepository(), aiSearch = defaultAiSearch, privacyGuard = createSemanticPrivacyGuard({ getArtistNames: () => catalog.getArtistNames() }) } = {}) {
  return async function search({ q, limit = 20, offset = 0, profile = null, signal }) {
    const validation = validateSemanticQuery(q); if (validation.details.length) throw new SemanticSearchError('Semantic search query is invalid', 'VALIDATION_ERROR')
    let privacy
    try { privacy = await privacyGuard.inspect(validation.query, profile) } catch { privacy = { safe: false, sanitizedQuery: null } }
    if (!privacy.safe) return { ...(await catalog.fallback({ q: validation.query, limit, offset })), meta: { search_mode: 'keyword_fallback' }, message: 'Search results retrieved via keyword fallback' }
    try {
      const response = await aiSearch({ purpose: 'semantic_search', query: privacy.sanitizedQuery, limit, offset }, { signal })
      if (!response?.success || !Array.isArray(response.data)) throw new Error('Invalid semantic response')
      const rows = await catalog.getRows(); const byId = new Map(rows.map((row) => [String(row.song_id), row])); const piiPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
      const sensitiveProfileValues = [profile?.name, profile?.display_name, profile?.email].filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim().toLocaleLowerCase())
      const safe = response.data.every((item) => {
        const reason = typeof item?.ai_reason === 'string' ? item.ai_reason : ''
        const exposesProfile = sensitiveProfileValues.some((value) => reason.toLocaleLowerCase().includes(value))
        return item && byId.has(String(item.id ?? item.song_id)) && !piiPattern.test(reason) && !exposesProfile
      })
      if (!safe) throw new Error('Unsafe semantic response')
      const ranked = deduplicateSemanticResults(response.data, byId)
      return { ...(await catalog.hydrate(ranked, limit, offset)), meta: { search_mode: 'semantic' }, message: 'Semantic search results retrieved' }
    } catch {
      return { ...(await catalog.fallback({ q: validation.query, limit, offset })), meta: { search_mode: 'keyword_fallback' }, message: 'Search results retrieved via keyword fallback' }
    }
  }
}
