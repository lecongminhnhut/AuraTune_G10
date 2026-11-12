import { supabase } from '../../database/supabaseClient.js';

/**
 * Mood Catalog Repository (Feature 103)
 * Strictly queries active Songs and public Mood Playlists (FR-003, FR-008).
 * Never returns albums or artists.
 */

export const MOOD_SONG_CATALOG = [
  {
    id: 't8',
    song_id: 't8',
    title: 'Midnight Coffee',
    subtitle: 'AuraTune Studio',
    artist: 'AuraTune Studio',
    artist_id: 'auratune-studio',
    album: 'Lofi bên cửa sổ',
    album_id: 'al-lofi-cua-so',
    genre: 'lofi',
    duration: 204,
    mood_tags: ['chill', 'focus', 'study_work', 'late_night'],
    audio_url: '/api/v1/songs/t8/stream',
    image_url: 'ocean',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't9',
    song_id: 't9',
    title: 'Rainy Window',
    subtitle: 'AuraTune Studio',
    artist: 'AuraTune Studio',
    artist_id: 'auratune-studio',
    album: 'Lofi bên cửa sổ',
    album_id: 'al-lofi-cua-so',
    genre: 'lofi',
    duration: 178,
    mood_tags: ['chill', 'late_night', 'melancholy'],
    audio_url: '/api/v1/songs/t9/stream',
    image_url: 'night',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't10',
    song_id: 't10',
    title: 'Slow Afternoon',
    subtitle: 'AuraTune Studio',
    artist: 'AuraTune Studio',
    artist_id: 'auratune-studio',
    album: 'Deep Focus',
    album_id: 'al-deep-focus',
    genre: 'chill',
    duration: 252,
    mood_tags: ['focus', 'study_work', 'chill'],
    audio_url: '/api/v1/songs/t10/stream',
    image_url: 'forest',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't1',
    song_id: 't1',
    title: 'Nàng thơ',
    subtitle: 'Hoàng Dũng',
    artist: 'Hoàng Dũng',
    artist_id: 'hoang-dung',
    album: '25',
    album_id: 'al-25',
    genre: 'ballad',
    duration: 261,
    mood_tags: ['chill', 'travel_commute'],
    audio_url: '/api/v1/songs/t1/stream',
    image_url: 'rose',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't2',
    song_id: 't2',
    title: 'Bước qua mùa cô đơn',
    subtitle: 'Vũ.',
    artist: 'Vũ.',
    artist_id: 'vu',
    album: 'Một vạn năm',
    album_id: 'al-mot-van-nam',
    genre: 'indie',
    duration: 248,
    mood_tags: ['melancholy', 'late_night'],
    audio_url: '/api/v1/songs/t2/stream',
    image_url: 'night',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't3',
    song_id: 't3',
    title: 'Có em',
    subtitle: 'Madihu, Low G',
    artist: 'Madihu, Low G',
    artist_id: 'madihu',
    album: 'Có em',
    album_id: 'al-co-em',
    genre: 'rnb',
    duration: 224,
    mood_tags: ['chill', 'travel_commute'],
    audio_url: '/api/v1/songs/t3/stream',
    image_url: 'sunset',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't4',
    song_id: 't4',
    title: 'Thích em hơi nhiều',
    subtitle: 'Wren Evans',
    artist: 'Wren Evans',
    artist_id: 'wren-evans',
    album: 'Loi Choi',
    album_id: 'al-loi-choi',
    genre: 'vpop',
    duration: 192,
    mood_tags: ['energetic', 'workout'],
    audio_url: '/api/v1/songs/t4/stream',
    image_url: 'violet',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 't5',
    song_id: 't5',
    title: 'Chuyện rằng',
    subtitle: 'Thịnh Suy',
    artist: 'Thịnh Suy',
    artist_id: 'thinh-suy',
    album: 'Chuyện rằng',
    album_id: 'al-chuyen-rang',
    genre: 'indie',
    duration: 253,
    mood_tags: ['chill', 'melancholy'],
    audio_url: '/api/v1/songs/t5/stream',
    image_url: 'ocean',
    is_active: true,
    deleted_at: null,
  },
  // Inactive/deleted fixtures for boundary testing
  {
    id: 't-deleted',
    song_id: 't-deleted',
    title: 'Deleted Track',
    is_active: false,
    deleted_at: '2026-01-01T00:00:00Z',
  },
];

export const MOOD_PLAYLIST_CATALOG = [
  {
    id: 'lofi-chill',
    title: 'Lofi bên cửa sổ',
    subtitle: 'AuraTune Official',
    description: 'Nhịp beat chậm rãi để thư giãn và tập trung',
    track_count: 32,
    is_official: true,
    cover: 'ocean',
    image_url: 'ocean',
    mood_tags: ['chill', 'late_night', 'study_work'],
    status: 'Public',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus Ambient',
    subtitle: 'AuraTune Official',
    description: 'Không gian âm thanh tối giản giúp tập trung cao độ',
    track_count: 20,
    is_official: true,
    cover: 'forest',
    image_url: 'forest',
    mood_tags: ['focus', 'study_work'],
    status: 'Public',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 'aura-mix',
    title: 'Aura Mix hôm nay',
    subtitle: 'Tuyển tập thịnh hành',
    description: 'Năng lượng bùng nổ cho ngày mới',
    track_count: 24,
    is_official: true,
    cover: 'aurora',
    image_url: 'aurora',
    mood_tags: ['energetic', 'workout'],
    status: 'Public',
    is_active: true,
    deleted_at: null,
  },
  {
    id: 'indie-viet',
    title: 'Indie Việt dịu êm',
    subtitle: 'AuraTune Official',
    description: 'Những câu chuyện nhỏ trên từng chuyến đi',
    track_count: 18,
    is_official: true,
    cover: 'sunset',
    image_url: 'sunset',
    mood_tags: ['travel_commute', 'chill'],
    status: 'Public',
    is_active: true,
    deleted_at: null,
  },
  // Private playlist fixture for boundary testing (must not be exposed)
  {
    id: 'private-mood-pl',
    title: 'Private Playlist',
    status: 'Private',
    is_active: true,
    deleted_at: null,
  },
];

let useInMemoryOnly = process.env.NODE_ENV === 'test';

export function setUseInMemory(value) {
  useInMemoryOnly = Boolean(value);
}

export async function findSongById(id) {
  if (!id) return null;

  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          song_id: data.id,
          title: data.title,
          subtitle: data.artist || 'AuraTune Artist',
          artist: data.artist,
          artist_id: data.artist_id || 'unknown-artist',
          album: data.album,
          album_id: data.album_id,
          genre: data.genre,
          duration: data.duration || 180,
          audio_url: `/api/v1/songs/${data.id}/stream`,
          image_url: data.cover || data.image_url || 'ocean',
          is_active: data.is_active !== false,
          deleted_at: data.deleted_at || null,
        };
      }
    } catch {
      // Fall through to in-memory fixtures
    }
  }

  const found = MOOD_SONG_CATALOG.find(
    (s) => (s.id === id || s.song_id === id) && s.is_active && !s.deleted_at
  );
  return found || null;
}

export async function findPlaylistById(id) {
  if (!id) return null;

  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .eq('status', 'Public')
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          subtitle: data.is_official ? 'AuraTune Curators' : (data.creator_name || 'Người dùng AuraTune'),
          description: data.description || '',
          track_count: data.track_count || 10,
          is_official: Boolean(data.is_official),
          cover: data.cover || 'ocean',
          image_url: data.image_url || data.cover || 'ocean',
          status: data.status,
          is_active: data.is_active !== false,
          deleted_at: data.deleted_at || null,
        };
      }
    } catch {
      // Fall through to in-memory fixtures
    }
  }

  const found = MOOD_PLAYLIST_CATALOG.find(
    (p) => p.id === id && p.is_active && !p.deleted_at && p.status === 'Public'
  );
  return found || null;
}

export async function findEntity(type, id) {
  if (!type || !id) return null;

  // STRICT ENTITY BOUNDARY (FR-003): Only 'song' and 'playlist'.
  // Albums and Artists are explicitly rejected!
  if (type === 'song') {
    return findSongById(id);
  }
  if (type === 'playlist') {
    return findPlaylistById(id);
  }

  return null;
}

export async function getSongsByMoodTag(tag, limit = 20) {
  const norm = (tag || '').trim().toLowerCase();
  const matched = MOOD_SONG_CATALOG.filter(
    (s) => s.is_active && !s.deleted_at && s.mood_tags?.includes(norm)
  );
  return matched.slice(0, limit);
}

export async function getPublicMoodPlaylists(tag, limit = 10) {
  const norm = (tag || '').trim().toLowerCase();
  const matched = MOOD_PLAYLIST_CATALOG.filter(
    (p) => p.is_active && !p.deleted_at && p.status === 'Public' && (norm === '' || p.mood_tags?.includes(norm))
  );
  return matched.slice(0, limit);
}

export default {
  MOOD_SONG_CATALOG,
  MOOD_PLAYLIST_CATALOG,
  findSongById,
  findPlaylistById,
  findEntity,
  getSongsByMoodTag,
  getPublicMoodPlaylists,
  setUseInMemory,
};
