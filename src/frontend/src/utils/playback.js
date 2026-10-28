export const getDurationSeconds = (duration) => {
  const [minutes, seconds] = duration.split(':').map(Number)
  return minutes * 60 + seconds
}

export const formatTime = (seconds, padMinutes = false) => {
  const value = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(value / 60)).padStart(padMinutes ? 2 : 1, '0')}:${String(value % 60).padStart(2, '0')}`
}

export function selectAdjacentTrack(state, direction, random = Math.random) {
  const currentIndex = state.queue.findIndex((track) => track.id === state.track.id)
  let nextIndex = currentIndex + direction

  if (state.shuffle && direction > 0 && state.queue.length > 1) {
    const candidates = state.queue.filter((track) => track.id !== state.track.id)
    return { ...state, track: candidates[Math.floor(random() * candidates.length)], elapsed: 0 }
  }

  if (nextIndex < 0 || nextIndex >= state.queue.length) {
    if (state.repeatMode === 'all') nextIndex = (nextIndex + state.queue.length) % state.queue.length
    else return { ...state, elapsed: direction > 0 ? getDurationSeconds(state.track.duration) : 0, isPlaying: direction > 0 ? false : state.isPlaying }
  }

  return { ...state, track: state.queue[nextIndex], elapsed: 0 }
}

export function advancePlayback(state) {
  if (!state.isPlaying) return state
  const duration = getDurationSeconds(state.track.duration)
  if (state.elapsed + 1 < duration) return { ...state, elapsed: state.elapsed + 1 }
  if (state.repeatMode === 'one') return { ...state, elapsed: 0 }
  return selectAdjacentTrack(state, 1)
}
