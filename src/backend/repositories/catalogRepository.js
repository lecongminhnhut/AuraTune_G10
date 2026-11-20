import { supabase } from '../../database/supabaseClient.js';
import { demoSongs } from '../data/demoSongs.js';

// Master catalog fixtures aligned with src/frontend/src/utils/mockData.js
export const CATALOG_SONGS = [
  { id: 't1', song_id: 't1', title: 'Nàng thơ', subtitle: 'Hoàng Dũng', artist: 'Hoàng Dũng', artist_id: 'hoang-dung', album: '25', album_id: 'al-25', genre: 'ballad', duration: 261, total_plays: 1200000, is_active: true, deleted_at: null, image_url: 'rose' },
  { id: 't2', song_id: 't2', title: 'Bước qua mùa cô đơn', subtitle: 'Vũ.', artist: 'Vũ.', artist_id: 'vu', album: 'Một vạn năm', album_id: 'al-mot-van-nam', genre: 'indie', duration: 248, total_plays: 986000, is_active: true, deleted_at: null, image_url: 'night' },
  { id: 't3', song_id: 't3', title: 'Có em', subtitle: 'Madihu, Low G', artist: 'Madihu, Low G', artist_id: 'madihu', album: 'Có em', album_id: 'al-co-em', genre: 'rnb', duration: 224, total_plays: 842000, is_active: true, deleted_at: null, image_url: 'sunset' },
  { id: 't4', song_id: 't4', title: 'Thích em hơi nhiều', subtitle: 'Wren Evans', artist: 'Wren Evans', artist_id: 'wren-evans', album: 'Loi Choi', album_id: 'al-loi-choi', genre: 'vpop', duration: 192, total_plays: 765000, is_active: true, deleted_at: null, image_url: 'violet' },
  { id: 't5', song_id: 't5', title: 'Chuyện rằng', subtitle: 'Thịnh Suy', artist: 'Thịnh Suy', artist_id: 'thinh-suy', album: 'Chuyện rằng', album_id: 'al-chuyen-rang', genre: 'indie', duration: 253, total_plays: 652000, is_active: true, deleted_at: null, image_url: 'ocean' },
  { id: 't6', song_id: 't6', title: 'Tình đắng như ly cà phê', subtitle: '大木, Nân', artist: '大木, Nân', artist_id: 'nan', album: 'Tình đắng', album_id: 'al-tinh-dang', genre: 'vpop', duration: 217, total_plays: 601000, is_active: true, deleted_at: null, image_url: 'forest' },
  { id: 't7', song_id: 't7', title: '3107', subtitle: 'W/n, Duongg, Nâu', artist: 'W/n, Duongg, Nâu', artist_id: 'wn', album: '3107', album_id: 'al-3107', genre: 'rnb', duration: 222, total_plays: 588000, is_active: true, deleted_at: null, image_url: 'aurora' },
  { id: 't8', song_id: 't8', title: 'Midnight Coffee', subtitle: 'AuraTune Studio', artist: 'AuraTune Studio', artist_id: 'auratune-studio', album: 'Lofi bên cửa sổ', album_id: 'al-lofi-cua-so', genre: 'lofi', duration: 204, total_plays: 24000, is_active: true, deleted_at: null, image_url: 'ocean' },
  { id: 't9', song_id: 't9', title: 'Rainy Window', subtitle: 'AuraTune Studio', artist: 'AuraTune Studio', artist_id: 'auratune-studio', album: 'Lofi bên cửa sổ', album_id: 'al-lofi-cua-so', genre: 'lofi', duration: 178, total_plays: 18000, is_active: true, deleted_at: null, image_url: 'night' },
  { id: 't10', song_id: 't10', title: 'Slow Afternoon', subtitle: 'AuraTune Studio', artist: 'AuraTune Studio', artist_id: 'auratune-studio', album: 'Deep Focus', album_id: 'al-deep-focus', genre: 'chill', duration: 252, total_plays: 21000, is_active: true, deleted_at: null, image_url: 'forest' },
  // Deleted/Inactive song fixture for FR-008 hydration testing
  { id: 'deleted-song-99', song_id: 'deleted-song-99', title: 'Deleted Song', is_active: false, deleted_at: '2026-01-01' },
];

export const CATALOG_ALBUMS = [
  { id: 'al-25', title: '25', subtitle: 'Hoàng Dũng', artist_id: 'hoang-dung', release_year: 2022, track_count: 9, cover: 'rose', is_active: true, deleted_at: null },
  { id: 'al-mot-van-nam', title: 'Một vạn năm', subtitle: 'Vũ.', artist_id: 'vu', release_year: 2022, track_count: 8, cover: 'night', is_active: true, deleted_at: null },
  { id: 'al-co-em', title: 'Có em', subtitle: 'Madihu', artist_id: 'madihu', release_year: 2023, track_count: 6, cover: 'sunset', is_active: true, deleted_at: null },
  { id: 'al-loi-choi', title: 'Loi Choi', subtitle: 'Wren Evans', artist_id: 'wren-evans', release_year: 2023, track_count: 10, cover: 'violet', is_active: true, deleted_at: null },
  { id: 'al-chuyen-rang', title: 'Chuyện rằng', subtitle: 'Thịnh Suy', artist_id: 'thinh-suy', release_year: 2020, track_count: 5, cover: 'ocean', is_active: true, deleted_at: null },
  { id: 'al-tinh-dang', title: 'Tình đắng', subtitle: 'Nân', artist_id: 'nan', release_year: 2021, track_count: 4, cover: 'forest', is_active: true, deleted_at: null },
  { id: 'al-3107', title: '3107', subtitle: 'W/n', artist_id: 'wn', release_year: 2019, track_count: 7, cover: 'aurora', is_active: true, deleted_at: null },
  { id: 'al-lofi-cua-so', title: 'Lofi bên cửa sổ', subtitle: 'AuraTune Studio', artist_id: 'auratune-studio', release_year: 2026, track_count: 12, cover: 'ocean', is_active: true, deleted_at: null },
  { id: 'al-deep-focus', title: 'Deep Focus', subtitle: 'AuraTune Studio', artist_id: 'auratune-studio', release_year: 2026, track_count: 10, cover: 'forest', is_active: true, deleted_at: null },
];

export const CATALOG_ARTISTS = [
  { id: 'hoang-dung', title: 'Hoàng Dũng', subtitle: 'Ca sĩ, nhạc sĩ', bio: 'Ca sĩ, nhạc sĩ với giọng hát ấm', follower_count: 154000, cover: 'rose', is_active: true, deleted_at: null },
  { id: 'vu', title: 'Vũ.', subtitle: 'Nghệ sĩ Indie Pop', bio: 'Nghệ sĩ indie nổi tiếng', follower_count: 128500, cover: 'night', is_active: true, deleted_at: null },
  { id: 'madihu', title: 'Madihu', subtitle: 'R&B / Soul', bio: 'Giọng ca trẻ mang màu sắc R&B', follower_count: 92000, cover: 'sunset', is_active: true, deleted_at: null },
  { id: 'wren-evans', title: 'Wren Evans', subtitle: 'V-Pop hiện đại', bio: 'Nghệ sĩ trẻ với phong cách pop', follower_count: 110000, cover: 'violet', is_active: true, deleted_at: null },
  { id: 'thinh-suy', title: 'Thịnh Suy', subtitle: 'Indie Việt', bio: 'Nhạc mộc mạc', follower_count: 85000, cover: 'ocean', is_active: true, deleted_at: null },
  { id: 'auratune-studio', title: 'AuraTune Studio', subtitle: 'Phòng thu nội bộ', bio: 'Nhạc không lời tập trung', follower_count: 45000, cover: 'forest', is_active: true, deleted_at: null },
];

export const CATALOG_PLAYLISTS = [
  { id: 'aura-mix', title: 'Aura Mix hôm nay', subtitle: 'Tuyển tập thịnh hành', description: 'Một chút dịu dàng', track_count: 24, is_official: true, cover: 'aurora', is_active: true, deleted_at: null },
  { id: 'lofi-chill', title: 'Lofi bên cửa sổ', subtitle: 'AuraTune Official', description: 'Nhịp beat chậm rãi để tập trung', track_count: 32, is_official: true, cover: 'ocean', is_active: true, deleted_at: null },
  { id: 'deep-focus', title: 'Deep Focus', subtitle: 'AuraTune Official', description: 'Không gian âm thanh tối giản', track_count: 20, is_official: true, cover: 'forest', is_active: true, deleted_at: null },
  { id: 'indie-viet', title: 'Indie Việt dịu êm', subtitle: 'AuraTune Official', description: 'Những câu chuyện nhỏ', track_count: 18, is_official: true, cover: 'sunset', is_active: true, deleted_at: null },
  { id: 'dem-thanh-pho', title: 'Đêm thành phố', subtitle: 'Minh Anh', description: 'Những thanh âm mềm mại', track_count: 18, is_official: false, cover: 'night', is_active: true, deleted_at: null },
];

let useInMemoryOnly = process.env.NODE_ENV === 'test';
const SCHEMA_FALLBACK_CODES = new Set(['42P01', '42703', 'PGRST205', 'PGRST200']);

export function setUseInMemory(value) {
  useInMemoryOnly = Boolean(value);
}

export async function findEntity(type, id) {
  if (!type || !id) return null;

  switch (type) {
    case 'song':
      return findSongById(id);
    case 'album':
      return findAlbumById(id);
    case 'artist':
      return findArtistById(id);
    case 'playlist':
      return findPlaylistById(id);
    default:
      return null;
  }
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

      if (!error && data) return data;
      if (error && !SCHEMA_FALLBACK_CODES.has(error.code)) {
        console.warn('Error querying songs from Supabase:', error.message);
      }
    } catch {
      // Fallback
    }
  }

  const song = CATALOG_SONGS.find((s) => (s.id === id || s.song_id === id) && s.is_active !== false && !s.deleted_at);
  return song || null;
}

export async function findAlbumById(id) {
  if (!id) return null;
  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) return data;
    } catch {}
  }
  const album = CATALOG_ALBUMS.find((a) => a.id === id && a.is_active !== false && !a.deleted_at);
  return album || null;
}

export async function findArtistById(id) {
  if (!id) return null;
  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) return data;
    } catch {}
  }
  const artist = CATALOG_ARTISTS.find((a) => a.id === id && a.is_active !== false && !a.deleted_at);
  return artist || null;
}

export async function findPlaylistById(id) {
  if (!id) return null;
  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) return data;
    } catch {}
  }
  const playlist = CATALOG_PLAYLISTS.find((p) => p.id === id && p.is_active !== false && !p.deleted_at);
  return playlist || null;
}

/**
 * Retrieve platform-wide popular songs ordered by total_plays DESC
 */
export async function getPopularSongs(limit = 10) {
  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('total_plays', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) return data;
    } catch {}
  }

  return CATALOG_SONGS.filter((s) => s.is_active !== false && !s.deleted_at)
    .sort((a, b) => (b.total_plays || 0) - (a.total_plays || 0))
    .slice(0, limit);
}

/**
 * Retrieve official starter playlists (is_official = true)
 */
export async function getOfficialPlaylists(limit = 10) {
  if (supabase && !useInMemoryOnly) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('is_active', true)
        .eq('is_official', true)
        .is('deleted_at', null)
        .limit(limit);

      if (!error && data && data.length > 0) return data;
    } catch {}
  }

  return CATALOG_PLAYLISTS.filter((p) => p.is_official && p.is_active !== false && !p.deleted_at)
    .slice(0, limit);
}

export default {
  findEntity,
  findSongById,
  findAlbumById,
  findArtistById,
  findPlaylistById,
  getPopularSongs,
  getOfficialPlaylists,
  setUseInMemory,
};
