import { getGenre, tracks as catalogTracks } from '../../utils/mockData.js'

export function formatDuration(seconds) {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (!hours) return `${minutes} phút`
  return `${hours} giờ ${minutes} phút`
}

export function getMockListeningAnalysis(range = 'all', options = {}) {
  let history = options.history
  const userId = options.userId || 'u-demo'

  if (!history) {
    try {
      const stored = localStorage.getItem('auratune-demo-state-v1')
      if (stored) {
        const parsed = JSON.parse(stored)
        history = parsed.libraries?.[userId]?.history || parsed.libraries?.['u-demo']?.history || []
      }
    } catch {
      // Fallback if localStorage is inaccessible
      history = []
    }
  }

  if (!history || history.length === 0) {
    return {
      success: true,
      message: 'Insufficient listening history for analysis',
      data: {
        userId,
        range,
        hasSufficientData: false,
        totalDurationSeconds: 0,
        formattedTotalDuration: '0 phút',
        totalPlays: 0,
        uniqueTracksCount: 0,
        topGenres: [],
        calculatedAt: new Date().toISOString()
      },
      error: null
    }
  }

  const days = range === '7' ? 7 : range === '30' ? 30 : null
  const since = days ? Date.now() - days * 86400000 : 0

  const trackCatalog = options.tracks || catalogTracks
  const findTrack = (id) => trackCatalog.find((t) => t.id === id)

  // Filter eligible playback records (FR-003, FR-012)
  const eligible = history
    .map((entry) => {
      const trackId = entry.trackId || entry.song_id
      const listened = entry.listened ?? entry.listened_duration ?? 0
      const playedAt = entry.playedAt || entry.played_at || new Date().toISOString()
      const track = findTrack(trackId)
      return { entry: { ...entry, trackId, listened, playedAt }, track }
    })
    .filter(({ entry, track }) => {
      if (!track || !entry.trackId) return false
      if (!entry.listened || entry.listened <= 0) return false
      return new Date(entry.playedAt).getTime() >= since
    })

  if (eligible.length < 1) {
    return {
      success: true,
      message: 'Insufficient listening history for analysis',
      data: {
        userId,
        range,
        hasSufficientData: false,
        totalDurationSeconds: 0,
        formattedTotalDuration: '0 phút',
        totalPlays: 0,
        uniqueTracksCount: 0,
        topGenres: [],
        calculatedAt: new Date().toISOString()
      },
      error: null
    }
  }

  const totalDurationSeconds = eligible.reduce((sum, { entry }) => sum + entry.listened, 0)
  const totalPlays = eligible.length
  const uniqueTrackIds = new Set(eligible.map(({ entry }) => entry.trackId))
  const uniqueTracksCount = uniqueTrackIds.size

  // Group by genre (FR-012: exclude tracks where genre is null/empty)
  const genreMap = new Map()
  eligible.forEach(({ entry, track }) => {
    const genreId = track.genre
    if (!genreId || typeof genreId !== 'string' || !genreId.trim()) return

    const key = genreId.trim()
    const current = genreMap.get(key) || {
      genreId: key,
      accumulatedSeconds: 0,
      playsCount: 0
    }
    current.accumulatedSeconds += entry.listened
    current.playsCount += 1
    genreMap.set(key, current)
  })

  const totalGenreDuration = Array.from(genreMap.values()).reduce(
    (sum, item) => sum + item.accumulatedSeconds,
    0
  )

  // Rank genres: accumulatedSeconds DESC -> playsCount DESC -> genreName ASC (FR-014)
  const sortedGenres = Array.from(genreMap.values()).sort((a, b) => {
    if (b.accumulatedSeconds !== a.accumulatedSeconds) {
      return b.accumulatedSeconds - a.accumulatedSeconds
    }
    if (b.playsCount !== a.playsCount) {
      return b.playsCount - a.playsCount
    }
    const nameA = getGenre(a.genreId)?.name || a.genreId
    const nameB = getGenre(b.genreId)?.name || b.genreId
    return nameA.localeCompare(nameB)
  })

  const topGenres = sortedGenres.map((item, index) => {
    const genreMeta = getGenre(item.genreId)
    const genreName = genreMeta?.name || item.genreId
    const percentage =
      totalGenreDuration > 0
        ? Math.round((item.accumulatedSeconds / totalGenreDuration) * 1000) / 10
        : 0.0

    return {
      rank: index + 1,
      genreId: item.genreId,
      genreName,
      accumulatedSeconds: item.accumulatedSeconds,
      formattedDuration: formatDuration(item.accumulatedSeconds),
      percentage
    }
  })

  return {
    success: true,
    message: 'Listening analysis retrieved successfully',
    data: {
      userId,
      range,
      hasSufficientData: true,
      totalDurationSeconds,
      formattedTotalDuration: formatDuration(totalDurationSeconds),
      totalPlays,
      uniqueTracksCount,
      topGenres,
      calculatedAt: new Date().toISOString()
    },
    error: null
  }
}
