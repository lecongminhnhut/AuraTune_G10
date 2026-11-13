import * as historyRepo from '../repositories/historyRepository.js';

const KNOWN_GENRES = {
  'lofi': { id: 'lo-fi', name: 'Lo-Fi' },
  'lo-fi': { id: 'lo-fi', name: 'Lo-Fi' },
  'indie': { id: 'indie', name: 'Indie Pop' },
  'rnb': { id: 'r-and-b', name: 'R&B' },
  'r-and-b': { id: 'r-and-b', name: 'R&B' },
  'vpop': { id: 'vpop', name: 'V-Pop' },
  'ballad': { id: 'ballad', name: 'Ballad' },
  'chill': { id: 'chill', name: 'Chill / Focus' },
  'pop': { id: 'pop', name: 'Pop' },
};

function resolveGenreMeta(rawGenre) {
  if (!rawGenre || typeof rawGenre !== 'string') return null;
  const key = rawGenre.trim().toLowerCase();
  if (KNOWN_GENRES[key]) {
    return KNOWN_GENRES[key];
  }
  const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'unknown';
  const name = rawGenre.trim().charAt(0).toUpperCase() + rawGenre.trim().slice(1);
  return { id: slug, name };
}

/**
 * Format duration in seconds into Vietnamese text:
 * 0 -> "0 phút"
 * 45 -> "1 phút"
 * 3660 -> "1 giờ 1 phút"
 * 48250 -> "13 giờ 24 phút"
 * 86400 -> "24 giờ 0 phút"
 */
export function formatTotalDuration(seconds) {
  if (!seconds || typeof seconds !== 'number' || seconds <= 0) {
    return '0 phút';
  }
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} phút`;
  }
  return `${hours} giờ ${minutes} phút`;
}

/**
 * Calculate listening analysis for authenticated user across time range (FR-003, FR-009, FR-012, FR-014).
 * Purely deterministic statistical aggregation without AI involvement.
 *
 * @param {string} userId
 * @param {'7' | '30' | 'all'} [range='all']
 * @param {object} [options]
 * @returns {Promise<object>}
 */
export async function calculateListeningAnalysis(userId, range = 'all', options = {}) {
  const validRange = ['7', '30', 'all'].includes(range) ? range : 'all';

  const aggregation = await historyRepo.findListeningAnalysis(userId, validRange, options);

  // Insufficient history evaluation: fewer than 1 eligible playback event (FR-007, FR-012)
  if (!aggregation || aggregation.totalPlays < 1) {
    return {
      userId,
      range: validRange,
      hasSufficientData: false,
      totalDurationSeconds: 0,
      formattedTotalDuration: '0 phút',
      totalPlays: 0,
      uniqueTracksCount: 0,
      topGenres: [],
      calculatedAt: new Date().toISOString(),
    };
  }

  const { totalPlays, uniqueTracksCount, totalDurationSeconds, genreBreakdown } = aggregation;

  // Filter valid genres (FR-012: exclude tracks where genre is null/empty from topGenres)
  const validGenreItems = (genreBreakdown || [])
    .map((item) => {
      const meta = resolveGenreMeta(item.genreName);
      if (!meta) return null;
      return {
        ...item,
        genreId: meta.id,
        genreName: meta.name,
      };
    })
    .filter(Boolean);

  const totalGenreDuration = validGenreItems.reduce((sum, item) => sum + item.accumulatedSeconds, 0);

  // Sort genres with tie-breaking: accumulated_seconds DESC -> plays_count DESC -> genre_name ASC (FR-014)
  validGenreItems.sort((a, b) => {
    if (b.accumulatedSeconds !== a.accumulatedSeconds) {
      return b.accumulatedSeconds - a.accumulatedSeconds;
    }
    if (b.playsCount !== a.playsCount) {
      return b.playsCount - a.playsCount;
    }
    return a.genreName.localeCompare(b.genreName);
  });

  const topGenres = validGenreItems.map((item, index) => {
    const percentage =
      totalGenreDuration > 0
        ? Math.round((item.accumulatedSeconds / totalGenreDuration) * 1000) / 10
        : 0.0;

    return {
      rank: index + 1,
      genreId: item.genreId,
      genreName: item.genreName,
      accumulatedSeconds: item.accumulatedSeconds,
      formattedDuration: formatTotalDuration(item.accumulatedSeconds),
      percentage,
    };
  });

  return {
    userId,
    range: validRange,
    hasSufficientData: true,
    totalDurationSeconds,
    formattedTotalDuration: formatTotalDuration(totalDurationSeconds),
    totalPlays,
    uniqueTracksCount,
    topGenres,
    calculatedAt: new Date().toISOString(),
  };
}
