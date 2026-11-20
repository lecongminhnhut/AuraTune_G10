import { getUserPreferenceSignals } from '../repositories/preferenceSignalRepository.js';
import { getPopularSongs, getOfficialPlaylists } from '../repositories/catalogRepository.js';
import { hydrateCandidates } from './catalogHydrationService.js';
import { getRecommendations as fetchAiRecommendations } from '../clients/aiServiceClient.js';

/**
 * Service for Personalized Recommendations (Feature 102)
 * Handles signal extraction, cold-start evaluation, AI microservice inference with 2.5s timeout,
 * graceful degradation fallback, catalog hydration, and deduplication.
 */
export async function getPersonalizedRecommendations(
  userId,
  {
    type = 'all',
    limit = 20,
    aiClient = fetchAiRecommendations,
    usePopularFallback = false,
  } = {}
) {
  if (!userId) {
    throw new Error('User ID is required for recommendations');
  }

  // 1. Retrieve user preference signals strictly scoped to authenticated user
  const signals = await getUserPreferenceSignals(userId);

  const { qualifying_plays_count = 0, liked_song_ids = [], followed_artist_ids = [] } = signals;

  // 2. Cold-Start Check (US2 / FR-005): < 3 plays AND 0 likes AND 0 follows
  const isColdStart =
    usePopularFallback ||
    (qualifying_plays_count < 3 && liked_song_ids.length === 0 && followed_artist_ids.length === 0);

  if (isColdStart) {
    const fallbackItems = await buildPopularFallback({ type, limit });
    return {
      userId,
      items: fallbackItems,
      isFallback: true,
      fallbackReason: 'COLD_START',
      message: null,
    };
  }

  // 3. Sufficient signals: invoke internal AI microservice (US1 & US3)
  const requestedTypes = type === 'all' ? ['song', 'album', 'artist', 'playlist'] : [type];

  try {
    const aiResponse = await aiClient({
      userId,
      signals: {
        played_song_ids: signals.played_song_ids || [],
        liked_song_ids: signals.liked_song_ids || [],
        followed_artist_ids: signals.followed_artist_ids || [],
      },
      requestedTypes,
      limit: Math.max(limit * 2, 30),
    });

    const candidates = aiResponse?.candidates || [];
    const filteredCandidates =
      type === 'all' ? candidates : candidates.filter((c) => c.type === type);

    // Hydrate candidates and filter inactive/deleted items (FR-008, FR-015)
    let hydratedItems = await hydrateCandidates(filteredCandidates, { isFallback: false });

    // If AI service candidates yielded 0 active items after hydration, fallback gracefully
    if (hydratedItems.length === 0) {
      const fallbackItems = await buildPopularFallback({ type, limit });
      return {
        userId,
        items: fallbackItems,
        isFallback: true,
        fallbackReason: 'AI_SERVICE_UNAVAILABLE',
        message: 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì',
      };
    }

    if (hydratedItems.length > limit) {
      hydratedItems = hydratedItems.slice(0, limit);
    }

    return {
      userId,
      items: hydratedItems,
      isFallback: false,
      fallbackReason: null,
      message: null,
    };
  } catch (error) {
    // US3 / EF-01: AI downtime or timeout (> 2.5s) resilience
    console.warn(
      `AI Service inference failed or timed out for user ${userId}: ${error.message}. Serving popular fallback.`
    );

    const fallbackItems = await buildPopularFallback({ type, limit });
    return {
      userId,
      items: fallbackItems,
      isFallback: true,
      fallbackReason: 'AI_SERVICE_UNAVAILABLE',
      message: 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì',
    };
  }
}

/**
 * Builds popular fallback items from platform-wide popular songs and official playlists
 */
async function buildPopularFallback({ type = 'all', limit = 20 } = {}) {
  const candidateList = [];

  if (type === 'all' || type === 'song') {
    const popSongs = await getPopularSongs(limit);
    popSongs.forEach((song) => {
      candidateList.push({ type: 'song', id: song.id || song.song_id });
    });
  }

  if (type === 'all' || type === 'playlist') {
    const offPlaylists = await getOfficialPlaylists(limit);
    offPlaylists.forEach((playlist) => {
      candidateList.push({ type: 'playlist', id: playlist.id });
    });
  }

  if (type === 'album') {
    // Fallback popular albums if type is explicitly 'album'
    candidateList.push(
      { type: 'album', id: 'al-25' },
      { type: 'album', id: 'al-mot-van-nam' },
      { type: 'album', id: 'al-lofi-cua-so' }
    );
  }

  if (type === 'artist') {
    // Fallback popular artists if type is explicitly 'artist'
    candidateList.push(
      { type: 'artist', id: 'hoang-dung' },
      { type: 'artist', id: 'vu' },
      { type: 'artist', id: 'auratune-studio' }
    );
  }

  const hydrated = await hydrateCandidates(candidateList, { isFallback: true });
  return hydrated.slice(0, limit);
}

export default {
  getPersonalizedRecommendations,
};
