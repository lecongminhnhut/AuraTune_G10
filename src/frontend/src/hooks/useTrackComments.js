import { useCallback, useEffect, useRef, useState } from 'react'
import { commentApi as defaultApi } from '../services/commentApi.js'

// Feature 046: comments of one catalog song, read from and written to the backend.
// `viewerKey` changes when the listener signs in or out, so the list is read again and
// the delete actions match the new viewer (FR-011).
export function useTrackComments(songId, { enabled = true, viewerKey = null, api = defaultApi } = {}) {
  const [state, setState] = useState({ songId: null, status: 'idle', comments: [], error: null })
  const [posting, setPosting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const currentSong = useRef(songId)
  currentSong.current = songId

  useEffect(() => {
    if (!enabled || !songId) return undefined
    const controller = new AbortController()
    setState((previous) => ({ songId, status: 'loading', comments: previous.songId === songId ? previous.comments : [], error: null }))
    api.list(songId, { signal: controller.signal })
      .then(({ comments }) => setState({ songId, status: 'ready', comments, error: null }))
      .catch((error) => {
        if (error?.name !== 'AbortError') setState({ songId, status: 'error', comments: [], error: error.message })
      })
    return () => controller.abort()
  }, [api, enabled, songId, viewerKey, attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  // Resolves to null on success, or to the error message; the caller keeps the text on failure (FR-013).
  const post = useCallback(async (text) => {
    const targetSong = songId
    setPosting(true)
    try {
      const comment = await api.create(targetSong, text)
      if (currentSong.current === targetSong) {
        setState((previous) => (previous.songId === targetSong ? { ...previous, status: 'ready', comments: [comment, ...previous.comments] } : previous))
      }
      return null
    } catch (error) {
      return error.message
    } finally {
      setPosting(false)
    }
  }, [api, songId])

  // Resolves to null on success, or to the error message.
  const remove = useCallback(async (commentId) => {
    setDeletingId(commentId)
    try {
      await api.remove(commentId)
      setState((previous) => ({ ...previous, comments: previous.comments.filter((comment) => comment.id !== commentId) }))
      return null
    } catch (error) {
      if (error.status === 404) {
        setState((previous) => ({ ...previous, comments: previous.comments.filter((comment) => comment.id !== commentId) }))
        return null
      }
      return error.message
    } finally {
      setDeletingId(null)
    }
  }, [api])

  const current = state.songId === songId ? state : { status: enabled && songId ? 'loading' : 'idle', comments: [], error: null }
  return { ...current, posting, deletingId, retry, post, remove }
}

export default useTrackComments
