import { useCallback, useEffect, useRef, useState } from 'react'
import { searchMetadata } from '../../services/searchApi.js'
import { normalizeSearchQuery } from '../../utils/searchNormalization.js'

const empty = { tracks: [], artists: [], albums: [], playlists: [] }
const groupFor = (type) => type === 'track' ? 'tracks' : `${type}s`
const groupResults = (items) => items.reduce((result, item) => { const group = groupFor(item.type); if (result[group]) result[group].push(item); return result }, { ...empty, tracks: [], artists: [], albums: [], playlists: [] })

export default function useMetadataSearch(query, type, constraints = {}) {
  const [state, setState] = useState({ query: normalizeSearchQuery(query), results: empty, loading: false, error: null, pagination: { limit: 20, offset: 0, next_offset: null, has_more: false } })
  const requestId = useRef(0)
  const abortRef = useRef(null)
  const currentRef = useRef({ query, type, constraints })
  const load = useCallback(async (offset = 0, append = false) => {
    const trimmed = normalizeSearchQuery(query)
    if (trimmed.length < 2 || trimmed.length > 100) { setState((previous) => ({ ...previous, query: trimmed, results: empty, loading: false, error: trimmed.length > 100 ? 'Search terms must be 100 characters or fewer.' : null })); return }
    const id = ++requestId.current
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setState((previous) => ({ ...previous, query: trimmed, loading: true, error: null, results: append ? previous.results : empty }))
    try {
      const response = await searchMetadata({ q: trimmed, type, limit: 20, offset, ...constraints }, { signal: controller.signal })
      if (id !== requestId.current) return
      const next = groupResults(response.data)
      setState((previous) => ({ ...previous, loading: false, results: append ? { tracks: [...previous.results.tracks, ...next.tracks], artists: [...previous.results.artists, ...next.artists], albums: [...previous.results.albums, ...next.albums], playlists: [...previous.results.playlists, ...next.playlists] } : next, pagination: response.pagination, error: null }))
    } catch (error) {
      if (error.name === 'AbortError' || id !== requestId.current) return
      setState((previous) => ({ ...previous, loading: false, error }))
    }
  }, [query, type, constraints])
  useEffect(() => { currentRef.current = { query, type, constraints }; load(0, false); return () => abortRef.current?.abort() }, [query, type, constraints.genre, constraints.release_year, constraints.sort, load])
  const retry = useCallback(() => load(state.pagination.offset, state.pagination.offset > 0), [load, state.pagination.offset])
  const loadMore = useCallback(() => state.pagination.has_more && !state.loading ? load(state.pagination.next_offset, true) : undefined, [load, state.loading, state.pagination])
  return { ...state, retry, loadMore }
}
