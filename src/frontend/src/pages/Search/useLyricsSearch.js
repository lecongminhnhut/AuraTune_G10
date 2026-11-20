import { useCallback, useEffect, useRef, useState } from 'react'
import { searchLyrics } from '../../services/aiLyricsSearchApi.js'

export const normalizeLyricsQuery = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
export const validateLyricsQuery = (value) => { const query = normalizeLyricsQuery(value); return { query, error: !query || query.length > 200 || query.split(' ').length < 3 ? 'Enter at least 3 words and no more than 200 characters.' : null } }

const emptyPagination = { limit: 20, offset: 0, next_offset: null, has_more: false }
const initialState = { query: '', results: [], loading: false, error: null, validationError: null, pagination: emptyPagination, searchMode: 'ai', bannerDismissed: false }

export default function useLyricsSearch(query) {
  const [state, setState] = useState(initialState)
  const requestId = useRef(0); const abortRef = useRef(null); const inFlight = useRef(null)
  const load = useCallback(async (offset = 0, append = false) => {
    const { query: normalized, error: validationError } = validateLyricsQuery(query)
    if (validationError) { setState({ ...initialState, query: normalized, validationError }); return }
    if (!append && inFlight.current === normalized) return
    const id = ++requestId.current
    abortRef.current?.abort()
    const controller = new AbortController(); abortRef.current = controller; inFlight.current = normalized
    setState((previous) => ({ ...previous, query: normalized, results: append ? previous.results : [], loading: true, error: null, validationError: null, bannerDismissed: append ? previous.bannerDismissed : false }))
    try {
      const response = await searchLyrics({ q: normalized, limit: 20, offset }, { signal: controller.signal })
      if (id !== requestId.current) return
      setState((previous) => ({ ...previous, loading: false, results: append ? [...previous.results, ...response.data] : response.data, pagination: response.pagination, searchMode: response.meta?.search_mode || 'ai', error: null }))
    } catch (error) {
      if (error.name === 'AbortError' || id !== requestId.current) return
      setState((previous) => ({ ...previous, loading: false, error, results: [] }))
    } finally { if (inFlight.current === normalized) inFlight.current = null }
  }, [query])
  useEffect(() => { load(); return () => abortRef.current?.abort() }, [load])
  const retry = useCallback(() => load(state.pagination.offset, state.pagination.offset > 0), [load, state.pagination.offset])
  const loadMore = useCallback(() => state.pagination.has_more && !state.loading ? load(state.pagination.next_offset, true) : undefined, [load, state.loading, state.pagination])
  const dismissBanner = useCallback(() => setState((previous) => ({ ...previous, bannerDismissed: true })), [])
  return { ...state, retry, loadMore, dismissBanner }
}
