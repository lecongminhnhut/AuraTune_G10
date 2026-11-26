import { useCallback, useEffect, useState } from 'react'
import { fetchSongLyrics, isCatalogSongId } from '../services/songApi.js'

// Feature 044 (T031): lyrics for the full player.
// Demo tracks carry their lyrics in the app. Catalog songs load them from the backend the first
// time the lyrics panel is shown; results are cached for the session so changing tabs or
// coming back to a song does not request them again.

const cache = new Map()
const MAX_CACHED = 100

const remember = (songId, lyrics) => {
  cache.delete(songId)
  cache.set(songId, lyrics)
  if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value)
}

export const localLyricsOf = (track) => {
  const synced = Array.isArray(track?.lyrics) && track.lyrics.length ? track.lyrics : null
  const plain = typeof track?.plainLyrics === 'string' && track.plainLyrics.trim() ? track.plainLyrics : null
  return synced || plain ? { synced: synced ?? [], plain } : null
}

// Returns { status: 'ready' | 'loading' | 'error', synced, plain, retry }.
export function useTrackLyrics(track, { enabled = true, load = fetchSongLyrics } = {}) {
  const local = localLyricsOf(track)
  const songId = track?.id != null ? String(track.id) : ''
  const remote = !local && isCatalogSongId(songId)
  const [state, setState] = useState({ songId: '', status: 'idle', lyrics: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!remote || !enabled) return undefined
    const cached = cache.get(songId)
    if (cached) {
      setState({ songId, status: 'ready', lyrics: cached })
      return undefined
    }
    const controller = new AbortController()
    setState({ songId, status: 'loading', lyrics: null })
    load(songId, { signal: controller.signal })
      .then((lyrics) => {
        remember(songId, lyrics)
        setState({ songId, status: 'ready', lyrics })
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setState({ songId, status: 'error', lyrics: null })
      })
    return () => controller.abort()
  }, [remote, enabled, songId, attempt, load])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  if (local) return { status: 'ready', synced: local.synced, plain: local.plain, retry }
  if (!remote) return { status: 'ready', synced: [], plain: null, retry }
  const current = state.songId === songId ? state : { status: 'loading', lyrics: cache.get(songId) ?? null }
  if (current.lyrics) return { status: 'ready', synced: current.lyrics.synced, plain: current.lyrics.plain, retry }
  return { status: current.status === 'error' ? 'error' : 'loading', synced: [], plain: null, retry }
}

export default useTrackLyrics
