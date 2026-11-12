import { supabase } from '../../database/supabaseClient.js';
import { demoSongs } from '../data/demoSongs.js';

// Tra cứu bài hát cho trình phát (Group 040).
// Thứ tự: bảng `songs` trên Supabase (khi đã cấu hình và đã có bảng) -> danh mục demo.
// Tầng dữ liệu chính thức do Group 080 xây dựng; khi schema được chốt chỉ cần sửa normalizeSong.

const MISSING_TABLE_CODES = new Set(['42P01', 'PGRST205']);
const INVALID_INPUT_CODES = new Set(['22P02']); // ví dụ: song_id là uuid nhưng mã truyền vào là 't1'

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

function normalizeSong(row) {
  return {
    song_id: String(row.song_id ?? row.id),
    title: row.title ?? '',
    artist: row.artist ?? row.artist_name ?? null,
    album: row.album ?? row.album_title ?? null,
    duration: parseDurationSeconds(row.duration ?? row.duration_seconds),
    audio_url: row.audio_url ?? row.file_url ?? null,
    is_active: row.is_active ?? (row.status ? row.status === 'active' : true),
    source: 'database',
  };
}

async function findInDatabase(songId) {
  if (!supabase || songsTableMissing) return { song: null };
  const { data, error } = await supabase.from('songs').select('*').eq('song_id', songId).maybeSingle();
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
