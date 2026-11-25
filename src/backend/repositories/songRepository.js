import { supabase } from '../../database/supabaseClient.js';
import { demoSongs } from '../data/demoSongs.js';

// Tra cứu bài hát cho trình phát (Group 040).
// Thứ tự: bảng `songs` trên Supabase (khi đã cấu hình và đã có bảng) -> danh mục demo.
// Schema thật (scripts/seedMusicCatalog.js, searchRepository): songs(song_id, title, album_id,
// audio_url = URL Cloudinary, duration, genre, total_plays, image_url) -> albums -> artists.

const MISSING_TABLE_CODES = new Set(['42P01', 'PGRST205']);
const INVALID_INPUT_CODES = new Set(['22P02']); // ví dụ: song_id là bigint nhưng mã truyền vào là 't1'
const MISSING_RELATION_CODES = new Set(['42703', 'PGRST200']); // thiếu cột hoặc quan hệ để nhúng album/nghệ sĩ
const SONG_SELECT = '*, albums(album_id, title, image_url, artists(artist_id, name))';

let songsTableMissing = false;

export class SongLookupError extends Error {
  constructor(cause) {
    super('Không tra cứu được bài hát.');
    this.name = 'SongLookupError';
    this.cause = cause;
  }
}

export function parseDurationSeconds(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null;
  if (typeof value !== 'string' || !value.trim()) return null;
  if (/^\d+(\.\d+)?$/.test(value.trim())) return Number(value);
  const parts = value.trim().split(':').map(Number);
  if (parts.length < 2 || parts.some((part) => !Number.isFinite(part))) return null;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

const relation = (value) => (Array.isArray(value) ? value[0] ?? null : value ?? null);

export function normalizeSong(row) {
  const album = relation(row.albums);
  const artist = relation(row.artists) ?? relation(album?.artists);
  return {
    song_id: String(row.song_id ?? row.id),
    title: row.title ?? '',
    artist: artist?.name ?? row.artist ?? row.artist_name ?? null,
    artist_id: artist?.artist_id != null ? String(artist.artist_id) : null,
    album: album?.title ?? row.album ?? row.album_title ?? null,
    album_id: row.album_id != null ? String(row.album_id) : null,
    genre: row.genre ?? null,
    duration: parseDurationSeconds(row.duration ?? row.duration_seconds),
    cover_url: row.image_url ?? album?.image_url ?? null,
    audio_url: row.audio_url ?? row.file_url ?? null,
    lyrics: typeof row.lyrics === 'string' ? row.lyrics : null,
    is_active: !row.deleted_at && (row.is_active ?? (row.status ? row.status === 'active' : true)),
    source: 'database',
  };
}

let embedUnavailable = false;

// Lấy kèm album/nghệ sĩ; nếu Supabase chưa có quan hệ để nhúng thì đọc riêng bảng songs.
async function selectSongs(applyFilter) {
  if (!embedUnavailable) {
    const result = await applyFilter(supabase.from('songs').select(SONG_SELECT));
    if (!result.error || !MISSING_RELATION_CODES.has(result.error.code)) return result;
    embedUnavailable = true;
  }
  return applyFilter(supabase.from('songs').select('*'));
}

async function findInDatabase(songId) {
  if (!supabase || songsTableMissing) return { song: null };
  const { data, error } = await selectSongs((query) => query.eq('song_id', songId).maybeSingle());
  if (!error) return { song: data ? normalizeSong(data) : null };
  if (MISSING_TABLE_CODES.has(error.code)) {
    songsTableMissing = true;
    console.warn('Bảng songs chưa có trên Supabase; trình phát dùng danh mục demo.');
    return { song: null };
  }
  if (INVALID_INPUT_CODES.has(error.code)) return { song: null };
  return { song: null, error };
}

export async function findSongById(songId) {
  const { song, error } = await findInDatabase(songId);
  if (song) return song;
  const demo = demoSongs.find((item) => item.song_id === songId);
  if (demo) return { ...demo };
  if (error) throw new SongLookupError(error);
  return null;
}

// Metadata cho nhiều bài (đọc lại lịch sử nghe). Mã không có trong database thì lấy từ danh mục demo;
// lỗi database không chặn việc đọc lịch sử, chỉ làm thiếu metadata.
export async function findSongsByIds(songIds) {
  const ids = [...new Set(songIds.map(String))];
  const found = new Map();
  const numericIds = ids.filter((id) => /^\d+$/.test(id));
  if (supabase && !songsTableMissing && ids.length) {
    let { data, error } = await selectSongs((query) => query.in('song_id', ids));
    // Cột song_id kiểu số không nhận mã 't1': thử lại chỉ với các mã dạng số.
    if (error && INVALID_INPUT_CODES.has(error.code) && numericIds.length) {
      ({ data, error } = await selectSongs((query) => query.in('song_id', numericIds)));
    }
    if (error) console.warn('Không đọc được metadata bài hát cho lịch sử nghe:', error.message);
    for (const row of data ?? []) found.set(String(row.song_id ?? row.id), normalizeSong(row));
  }
  for (const id of ids) {
    if (found.has(id)) continue;
    const demo = demoSongs.find((item) => item.song_id === id);
    if (demo) found.set(id, { ...demo });
  }
  return found;
}
