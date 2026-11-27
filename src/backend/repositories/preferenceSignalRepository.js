import { supabase } from '../../database/supabaseClient.js';

// In-memory signals store for offline development and testing
const inMemoryPlayedHistory = [
  { user_id: 'u-demo', song_id: 't1', listened_duration: 261, played_at: new Date(Date.now() - 1000 * 3600).toISOString() },
  { user_id: 'u-demo', song_id: 't8', listened_duration: 204, played_at: new Date(Date.now() - 2000 * 3600).toISOString() },
  { user_id: 'u-demo', song_id: 't9', listened_duration: 178, played_at: new Date(Date.now() - 3000 * 3600).toISOString() },
  { user_id: 'u-demo', song_id: 't2', listened_duration: 248, played_at: new Date(Date.now() - 4000 * 3600).toISOString() },
  // Non-qualifying short play (< 30s) should be excluded
  { user_id: 'u-demo', song_id: 't6', listened_duration: 15, played_at: new Date(Date.now() - 5000 * 3600).toISOString() },
  // Play by another user (should be strictly isolated)
  { user_id: 'u-other-user', song_id: 't5', listened_duration: 253, played_at: new Date().toISOString() },
];

const inMemoryLikedSongs = [
  { user_id: 'u-demo', song_id: 't1' },
  { user_id: 'u-demo', song_id: 't2' },
  { user_id: 'u-other-user', song_id: 't7' },
];

const inMemoryFollowedArtists = [
  { user_id: 'u-demo', artist_id: 'hoang-dung' },
  { user_id: 'u-demo', artist_id: 'vu' },
  { user_id: 'u-other-user', artist_id: 'wn' },
];

let useInMemoryOnly = process.env.NODE_ENV === 'test';

export function setUseInMemory(value) {
  useInMemoryOnly = Boolean(value);
}

export function setInMemorySignals(userId, { history = [], likes = [], follows = [] } = {}) {
  clearInMemorySignals(userId);
  history.forEach((h) => inMemoryPlayedHistory.push({ user_id: userId, ...h }));
  likes.forEach((songId) => inMemoryLikedSongs.push({ user_id: userId, song_id: songId }));
  follows.forEach((artistId) => inMemoryFollowedArtists.push({ user_id: userId, artist_id: artistId }));
}

export function clearInMemorySignals(userId) {
  if (!userId) {
    inMemoryPlayedHistory.length = 0;
    inMemoryLikedSongs.length = 0;
    inMemoryFollowedArtists.length = 0;
    return;
  }
  const remHistory = inMemoryPlayedHistory.filter((item) => item.user_id !== userId);
  inMemoryPlayedHistory.length = 0;
  inMemoryPlayedHistory.push(...remHistory);

  const remLikes = inMemoryLikedSongs.filter((item) => item.user_id !== userId);
  inMemoryLikedSongs.length = 0;
  inMemoryLikedSongs.push(...remLikes);

  const remFollows = inMemoryFollowedArtists.filter((item) => item.user_id !== userId);
  inMemoryFollowedArtists.length = 0;
  inMemoryFollowedArtists.push(...remFollows);
}

/**
 * Retrieve qualifying user preference signals (FR-009)
 * Strictly scoped to authenticated caller (user_id = $userId)
 */
export async function getUserPreferenceSignals(userId, options = {}) {
  if (!userId) {
    throw new Error('User ID is required to retrieve preference signals');
  }

  if (supabase && !useInMemoryOnly && !options.useInMemory) {
    try {
      // 1. Qualifying listening history: 30 seconds, or 90% of a short track.
      const historyPromise = supabase
        .from('listening_history')
        .select('song_id, duration_listened, played_at, songs(duration)')
        .eq('user_id', userId)
        .gt('duration_listened', 0)
        .gte('played_at', new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString())
        .not('song_id', 'is', null)
        .order('played_at', { ascending: false });

      // 2. Liked songs
      const likesPromise = supabase
        .from('user_liked_songs')
        .select('song_id')
        .eq('user_id', userId)
        .not('song_id', 'is', null);

      // 3. Followed artists
      const followsPromise = supabase
        .from('user_follows_artist')
        .select('artist_id')
        .eq('user_id', userId)
        .not('artist_id', 'is', null);

      const [historyRes, likesRes, followsRes] = await Promise.all([
        historyPromise,
        likesPromise,
        followsPromise,
      ]);

      const failed = [historyRes, likesRes, followsRes].find((result) => result.error);
      if (failed) throw failed.error;
      const qualifyingPlays = (historyRes.data || []).filter((row) => {
        const rawDuration = Array.isArray(row.songs) ? row.songs[0]?.duration : row.songs?.duration;
        const trackDuration = typeof rawDuration === 'number' ? rawDuration : (() => {
          if (typeof rawDuration !== 'string') return null;
          if (/^\d+(\.\d+)?$/.test(rawDuration.trim())) return Number(rawDuration);
          return rawDuration.split(':').map(Number).reduce((sum, part) => sum * 60 + part, 0);
        })();
        return row.duration_listened >= 30 || (trackDuration > 0 && trackDuration < 30 && row.duration_listened >= trackDuration * 0.9);
      });
      const likedSongs = likesRes.data || [];
      const followedArtists = followsRes.data || [];
      const playedSongIds = [...new Set(qualifyingPlays.map((r) => r.song_id).filter(Boolean))];
      const likedSongIds = [...new Set(likedSongs.map((r) => r.song_id).filter(Boolean))];
      const followedArtistIds = [...new Set(followedArtists.map((r) => r.artist_id).filter(Boolean))];
      return {
        user_id: userId,
        played_song_ids: playedSongIds,
        qualifying_plays_count: qualifyingPlays.length,
        liked_song_ids: likedSongIds,
        followed_artist_ids: followedArtistIds,
      };
    } catch (err) {
      throw new Error(`Could not load listening preference signals: ${err.message}`);
    }
  }

  return getInMemoryPreferenceSignals(userId);
}

function getInMemoryPreferenceSignals(userId) {
  const userPlays = inMemoryPlayedHistory.filter(
    (h) => h.user_id === userId && (h.listened_duration ?? h.listened ?? 0) >= 30 && h.song_id
  );

  const playedSongIds = [...new Set(userPlays.map((h) => h.song_id))];

  const userLikes = inMemoryLikedSongs.filter(
    (l) => l.user_id === userId && l.song_id
  );
  const likedSongIds = [...new Set(userLikes.map((l) => l.song_id))];

  const userFollows = inMemoryFollowedArtists.filter(
    (f) => f.user_id === userId && f.artist_id
  );
  const followedArtistIds = [...new Set(userFollows.map((f) => f.artist_id))];

  return {
    user_id: userId,
    played_song_ids: playedSongIds,
    qualifying_plays_count: userPlays.length,
    liked_song_ids: likedSongIds,
    followed_artist_ids: followedArtistIds,
  };
}

export default {
  getUserPreferenceSignals,
  setInMemorySignals,
  clearInMemorySignals,
  setUseInMemory,
};
