import { useCallback, useEffect, useRef, useState } from 'react'
import { searchSemantic } from '../utils/semanticSearchAdapter.js'
import { validateSemanticQuery } from '../utils/semanticQuery.js'

const initial = { query: '', results: [], loading: false, error: null, validationError: null, searchMode: 'semantic', pagination: { limit: 20, offset: 0, next_offset: null, has_more: false } }

export default function useSemanticSearch(query, enabled = true, limit = 20) {
  const [state, setState] = useState(initial); const requestId = useRef(0); const abortRef = useRef(null)
  const load = useCallback(async (offset = 0, append = false) => {
    if (!enabled) { setState(initial); return }
    const validation = validateSemanticQuery(query)
    if (validation.error) { setState({ ...initial, query: validation.query, validationError: validation.error }); return }
    const id = ++requestId.current; abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller
    setState((previous) => ({ ...previous, query: validation.query, loading: true, error: null, validationError: null, results: append ? previous.results : [] }))
    try {
      const response = await searchSemantic({ q: validation.query, limit, offset }, { signal: controller.signal })
      if (id !== requestId.current) return
      setState((previous) => ({ ...previous, loading: false, results: append ? [...previous.results, ...response.data] : response.data, pagination: response.pagination, searchMode: response.meta?.search_mode || 'semantic', error: null }))
    } catch (error) { if (error.name === 'AbortError' || id !== requestId.current) return; setState((previous) => ({ ...previous, loading: false, results: [], error })) }
  }, [enabled, limit, query])
  useEffect(() => { load(); return () => abortRef.current?.abort() }, [load])
  const retry = useCallback(() => load(state.pagination.offset, state.pagination.offset > 0), [load, state.pagination.offset])
  const loadMore = useCallback(() => state.pagination.has_more && !state.loading ? load(state.pagination.next_offset, true) : undefined, [load, state.loading, state.pagination])
  return { ...state, retry, loadMore }
}
