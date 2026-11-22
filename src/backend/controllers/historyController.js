import { HistoryStorageUnavailableError } from '../repositories/listeningHistoryRepository.js';
import { SongLookupError } from '../repositories/songRepository.js';

// Lịch sử nghe của trình phát (Group 040, 041-FR-014). Trình phát chỉ gửi sự kiện khi phiên nghe
// đạt ngưỡng (30 giây hoặc nửa bài), sau đó cập nhật thời lượng nghe khi đổi bài, tạm dừng hoặc rời trang.

const SONG_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const ENTRY_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const MAX_LISTENED_SECONDS = 24 * 3600;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
// Bài không thuộc danh mục trong database: sai kiểu khóa (22P02) hoặc vi phạm khóa ngoại (23503).
const NOT_IN_CATALOG_CODES = new Set(['22P02', '23503']);

function sendError(res, status, error, message) {
  return res.status(status).json({ success: false, error, message });
}

function parseListened(value) {
  if (value === undefined) return 0;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > MAX_LISTENED_SECONDS) return null;
  return Math.round(value);
}

function toEntry(row, song = null) {
  return {
    id: String(row.id),
    song_id: String(row.song_id),
    listened_duration: Number(row.listened_duration) || 0,
    played_at: new Date(row.played_at).toISOString(),
    song,
  };
}

function songSummary(song) {
  if (!song) return null;
  return {
    id: song.song_id,
    title: song.title,
    artist: song.artist ?? null,
    artist_id: song.artist_id ?? null,
    album: song.album ?? null,
    album_id: song.album_id ?? null,
    genre: song.genre ?? null,
    duration: song.duration ?? null,
    cover_url: song.cover_url ?? null,
    is_active: song.is_active !== false,
  };
}

export function createHistoryController({ repository, findSong, findSongs }) {
  const userIdOf = (req) => String(req.user?.user_id ?? req.user?.id ?? '');

  const fail = (res, error) => {
    if (error instanceof HistoryStorageUnavailableError) {
      return sendError(res, 503, 'history_unavailable', 'Chưa cấu hình nơi lưu lịch sử nghe.');
    }
    if (error instanceof SongLookupError) {
      return sendError(res, 503, 'song_lookup_failed', 'Không tra cứu được bài hát, vui lòng thử lại.');
    }
    console.error('Listening history error:', error?.message ?? error);
    return sendError(res, 503, 'history_storage_failed', 'Không lưu hoặc đọc được lịch sử nghe, vui lòng thử lại.');
  };

  return {
    // POST /api/v1/users/me/history { songId, listenedSeconds }
    async record(req, res) {
      const userId = userIdOf(req);
      const songId = typeof req.body?.songId === 'string' ? req.body.songId.trim() : '';
      if (!SONG_ID_PATTERN.test(songId)) return sendError(res, 400, 'invalid_song_id', 'Mã bài hát không hợp lệ.');
      const listenedSeconds = parseListened(req.body?.listenedSeconds);
      if (listenedSeconds === null) return sendError(res, 400, 'invalid_listened_seconds', 'Thời lượng nghe không hợp lệ.');

      try {
        const song = await findSong(songId);
        if (!song) return sendError(res, 404, 'song_not_found', 'Không tìm thấy bài hát.');
        if (song.is_active === false) return sendError(res, 410, 'song_unavailable', 'Bài hát này hiện không khả dụng.');
        const row = await repository.insert({ userId, songId, listenedSeconds });
        return res.status(201).json({ success: true, data: toEntry(row, songSummary(song)) });
      } catch (error) {
        if (NOT_IN_CATALOG_CODES.has(error?.code)) {
          return sendError(res, 422, 'song_not_in_catalog', 'Bài hát này không có trong danh mục nên chưa lưu được lịch sử.');
        }
        return fail(res, error);
      }
    },

    // PATCH /api/v1/users/me/history/:entryId { listenedSeconds }
    async updateListened(req, res) {
      const userId = userIdOf(req);
      const { entryId } = req.params;
      if (!ENTRY_ID_PATTERN.test(entryId)) return sendError(res, 400, 'invalid_entry_id', 'Mã lượt nghe không hợp lệ.');
      const listenedSeconds = parseListened(req.body?.listenedSeconds);
      if (listenedSeconds === null || req.body?.listenedSeconds === undefined) {
        return sendError(res, 400, 'invalid_listened_seconds', 'Thời lượng nghe không hợp lệ.');
      }

      try {
        const row = await repository.raiseListened({ userId, id: entryId, listenedSeconds });
        if (!row) return sendError(res, 404, 'history_entry_not_found', 'Không tìm thấy lượt nghe.');
        return res.json({ success: true, data: toEntry(row) });
      } catch (error) {
        if (error?.code === '22P02') return sendError(res, 404, 'history_entry_not_found', 'Không tìm thấy lượt nghe.');
        return fail(res, error);
      }
    },

    // GET /api/v1/users/me/history?limit=50 — mới nhất trước, kèm metadata bài hát.
    async list(req, res) {
      const userId = userIdOf(req);
      const rawLimit = req.query.limit ?? String(DEFAULT_LIMIT);
      const limit = /^\d{1,3}$/.test(rawLimit) ? Number(rawLimit) : NaN;
      if (!(limit >= 1 && limit <= MAX_LIMIT)) return sendError(res, 400, 'invalid_limit', `limit phải từ 1 đến ${MAX_LIMIT}.`);

      try {
        const rows = await repository.listRecent(userId, limit);
        const songs = rows.length ? await findSongs(rows.map((row) => String(row.song_id))) : new Map();
        res.set('Cache-Control', 'private, no-store');
        return res.json({ success: true, data: rows.map((row) => toEntry(row, songSummary(songs.get(String(row.song_id))))) });
      } catch (error) {
        return fail(res, error);
      }
    },

    // DELETE /api/v1/users/me/history — xóa toàn bộ lịch sử của chính người dùng.
    async clear(req, res) {
      try {
        const removed = await repository.clear(userIdOf(req));
        return res.json({ success: true, data: { removed } });
      } catch (error) {
        return fail(res, error);
      }
    },
  };
}
