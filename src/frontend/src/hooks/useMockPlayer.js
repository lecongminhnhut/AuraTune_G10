import { useEffect, useState } from 'react'
import { featuredTrack, tracks } from '../utils/mockData.js'
import { advancePlayback, getDurationSeconds, selectAdjacentTrack } from '../utils/playback.js'

const libraryQueue = [featuredTrack, ...tracks.filter((track) => track.id !== featuredTrack.id)]

const shuffled = (items) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

export default function useMockPlayer() {
  const [state, setState] = useState({
    track: featuredTrack, playlistId: null, queue: libraryQueue, isPlaying: false,
    elapsed: 0, shuffle: false, repeatMode: 'off', playKey: 0,
  })
  const [volume, setVolume] = useState(68)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!state.isPlaying) return undefined
    const timer = window.setInterval(() => setState(advancePlayback), 1000)
    return () => window.clearInterval(timer)
  }, [state.isPlaying])

  // queueTracks: danh sách phát sẽ dùng làm hàng chờ (playlist, album, kết quả tìm kiếm...).
  const playTrack = (track, { queue, playlistId = null } = {}) => setState((previous) => {
    const baseQueue = queue?.length ? queue : (previous.queue.some((item) => item.id === track.id) ? previous.queue : libraryQueue)
    return {
      ...previous, track, playlistId,
      queue: baseQueue.some((item) => item.id === track.id) ? baseQueue : [track, ...baseQueue],
      elapsed: 0, isPlaying: true, playKey: previous.playKey + 1,
    }
  })

  const playCollection = (collectionTracks, { playlistId = null, shuffle = false } = {}) => {
    if (!collectionTracks.length) return
    const ordered = shuffle ? shuffled(collectionTracks) : collectionTracks
    setState((previous) => ({ ...previous, shuffle: shuffle || previous.shuffle }))
    playTrack(ordered[0], { queue: ordered, playlistId })
  }

  const togglePlayback = () => setState((previous) => ({
    ...previous, isPlaying: !previous.isPlaying,
    elapsed: previous.elapsed >= getDurationSeconds(previous.track.duration) ? 0 : previous.elapsed,
  }))

  const seek = (elapsed) => setState((previous) => ({ ...previous, elapsed: Math.max(0, Math.min(getDurationSeconds(previous.track.duration), elapsed)) }))
  const nextTrack = () => setState((previous) => selectAdjacentTrack(previous, 1))
  const previousTrack = () => setState((previous) => previous.elapsed > 3 ? { ...previous, elapsed: 0 } : selectAdjacentTrack(previous, -1))
  const toggleShuffle = () => setState((previous) => ({ ...previous, shuffle: !previous.shuffle }))
  const cycleRepeat = () => setState((previous) => ({ ...previous, repeatMode: { off: 'all', all: 'one', one: 'off' }[previous.repeatMode] }))

  // ---------- Quản lý hàng chờ (G05) ----------
  const currentIndex = state.queue.findIndex((item) => item.id === state.track.id)
  const upcoming = state.queue.slice(currentIndex + 1)

  // Trả về false nếu bài đã nằm trong hàng chờ phía sau bài đang phát.
  const addToQueue = (track) => {
    if (track.id === state.track.id || upcoming.some((item) => item.id === track.id)) return false
    setState((previous) => ({ ...previous, queue: [...previous.queue.filter((item) => item.id !== track.id), track] }))
    return true
  }

  const addManyToQueue = (items) => {
    const fresh = items.filter((track) => track.id !== state.track.id && !upcoming.some((item) => item.id === track.id))
    if (!fresh.length) return 0
    const ids = new Set(fresh.map((track) => track.id))
    setState((previous) => ({ ...previous, queue: [...previous.queue.filter((item) => !ids.has(item.id)), ...fresh] }))
    return fresh.length
  }

  const playNext = (track) => {
    if (track.id === state.track.id) return false
    setState((previous) => {
      const rest = previous.queue.filter((item) => item.id !== track.id)
      const index = rest.findIndex((item) => item.id === previous.track.id)
      rest.splice(index + 1, 0, track)
      return { ...previous, queue: rest }
    })
    return true
  }

  const removeFromQueue = (trackId) => {
    if (trackId === state.track.id) return
    setState((previous) => ({ ...previous, queue: previous.queue.filter((item) => item.id !== trackId) }))
  }

  // from/to là vị trí trong danh sách "tiếp theo" (không tính bài đang phát).
  const moveInQueue = (from, to) => setState((previous) => {
    const index = previous.queue.findIndex((item) => item.id === previous.track.id)
    const head = previous.queue.slice(0, index + 1)
    const next = previous.queue.slice(index + 1)
    if (from < 0 || from >= next.length || to < 0 || to >= next.length) return previous
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    return { ...previous, queue: [...head, ...next] }
  })

  const clearUpcoming = () => setState((previous) => ({ ...previous, queue: previous.queue.slice(0, previous.queue.findIndex((item) => item.id === previous.track.id) + 1) }))

  const playFromQueue = (trackId) => setState((previous) => {
    const track = previous.queue.find((item) => item.id === trackId)
    return track ? { ...previous, track, elapsed: 0, isPlaying: true, playKey: previous.playKey + 1 } : previous
  })

  return {
    ...state, upcoming, volume, setVolume, muted, setMuted,
    playTrack, playCollection, togglePlayback, seek, nextTrack, previousTrack, toggleShuffle, cycleRepeat,
    addToQueue, addManyToQueue, playNext, removeFromQueue, moveInQueue, clearUpcoming, playFromQueue,
  }
}
