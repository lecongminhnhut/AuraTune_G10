import { CommentStorageUnavailableError } from '../repositories/commentRepository.js';
import { SongLookupError } from '../repositories/songRepository.js';

// Group 040, Feature 046: comments on a song in the full player.
// Anyone can read (FR-006), only signed-in users can post (FR-008), and only the author or an
// administrator can delete (FR-010, FR-012). Comments are 1-300 characters after trimming (FR-009).

export const MAX_COMMENT_LENGTH = 300;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
// Comments are stored against the Supabase catalog, whose song ids are numbers.
const CATALOG_ID_PATTERN = /^\d{1,18}$/;
const FALLBACK_AUTHOR = 'Người nghe AuraTune';

function sendError(res, status, error, message) {
  return res.status(status).json({ success: false, error, message });
}

// Returns the trimmed text, or null when it is empty, too long or not a string.
export function normalizeCommentContent(value) {
  if (typeof value !== 'string') return null;
  // Remove control characters other than line breaks and tabs.
  const text = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  const length = [...text].length; // characters, not UTF-16 units (same as char_length in Postgres)
  return length >= 1 && length <= MAX_COMMENT_LENGTH ? text : null;
}

const relation = (value) => (Array.isArray(value) ? value[0] ?? null : value ?? null);

export function canDeleteComment(viewer, row) {
  if (!viewer) return false;
  const viewerId = String(viewer.user_id ?? viewer.id ?? '');
  return viewer.role === 'admin' || (viewerId !== '' && viewerId === String(row.user_id));
}

export function toComment(row, viewer = null) {
  const author = relation(row.author);
  return {
    id: String(row.id),
    song_id: String(row.song_id),
    content: row.content,
    created_at: new Date(row.created_at).toISOString(),
    author: {
      id: String(row.user_id),
      name: author?.display_name || author?.name || FALLBACK_AUTHOR,
      avatar_url: author?.avatar_url ?? null,
    },
    can_delete: canDeleteComment(viewer, row),
  };
}

function parseLimit(value) {
  if (value === undefined) return DEFAULT_LIMIT;
  const limit = Number(value);
  return Number.isInteger(limit) && limit >= 1 && limit <= MAX_LIMIT ? limit : null;
}

export function createCommentController({ repository, findSong }) {
  const fail = (res, error) => {
    if (error instanceof CommentStorageUnavailableError) {
      return sendError(res, 503, 'comments_unavailable', 'Bình luận tạm thời không khả dụng.');
    }
    if (error instanceof SongLookupError) {
      return sendError(res, 503, 'song_lookup_failed', 'Không tra cứu được bài hát, vui lòng thử lại.');
    }
    if (error?.code === '23503') return sendError(res, 404, 'song_not_found', 'Không tìm thấy bài hát.');
    if (error?.code === '23514') return sendError(res, 400, 'invalid_comment', `Bình luận phải có từ 1 đến ${MAX_COMMENT_LENGTH} ký tự.`);
    console.error('Song comments error:', error?.message ?? error);
    return sendError(res, 503, 'comment_storage_failed', 'Không lưu hoặc đọc được bình luận, vui lòng thử lại.');
  };

  // Validates the song id and loads the song; sends the error response and returns null when it fails.
  const requireSong = async (req, res) => {
    const songId = String(req.params.id ?? '');
    if (!CATALOG_ID_PATTERN.test(songId)) {
      sendError(res, 400, 'invalid_song_id', 'Mã bài hát không hợp lệ.');
      return null;
    }
    const song = await findSong(songId);
    if (!song) {
      sendError(res, 404, 'song_not_found', 'Không tìm thấy bài hát.');
      return null;
    }
    return song;
  };

  return {
    // GET /api/v1/songs/:id/comments?limit= — public; newest first.
    async list(req, res) {
      try {
        const limit = parseLimit(req.query.limit);
        if (limit === null) return sendError(res, 400, 'invalid_limit', `limit phải là số nguyên từ 1 đến ${MAX_LIMIT}.`);
        const song = await requireSong(req, res);
        if (!song) return undefined;
        const { rows, hasMore } = await repository.listBySong(song.song_id, limit);
        return res.json({
          success: true,
          message: 'Comments retrieved',
          data: rows.map((row) => toComment(row, req.user)),
          pagination: { limit, has_more: hasMore },
        });
      } catch (error) {
        return fail(res, error);
      }
    },

    // POST /api/v1/songs/:id/comments { content } — signed-in users only.
    async create(req, res) {
      try {
        const content = normalizeCommentContent(req.body?.content);
        if (content === null) {
          return sendError(res, 400, 'invalid_comment', `Bình luận phải có từ 1 đến ${MAX_COMMENT_LENGTH} ký tự.`);
        }
        const song = await requireSong(req, res);
        if (!song) return undefined;
        if (song.is_active === false) return sendError(res, 410, 'song_unavailable', 'Bài hát này hiện không khả dụng.');
        const userId = String(req.user?.user_id ?? req.user?.id ?? '');
        const row = await repository.insert({ songId: song.song_id, userId, content });
        return res.status(201).json({ success: true, message: 'Comment created', data: toComment(row, req.user) });
      } catch (error) {
        return fail(res, error);
      }
    },

    // DELETE /api/v1/comments/:id — the author or an administrator (checked here, FR-012).
    async remove(req, res) {
      try {
        const commentId = String(req.params.id ?? '');
        if (!CATALOG_ID_PATTERN.test(commentId)) return sendError(res, 400, 'invalid_comment_id', 'Mã bình luận không hợp lệ.');
        const row = await repository.findById(commentId);
        if (!row) return sendError(res, 404, 'comment_not_found', 'Không tìm thấy bình luận.');
        if (!canDeleteComment(req.user, row)) {
          return sendError(res, 403, 'forbidden', 'Bạn chỉ có thể xóa bình luận của mình.');
        }
        const removed = await repository.remove(commentId);
        if (!removed) return sendError(res, 404, 'comment_not_found', 'Không tìm thấy bình luận.');
        return res.json({ success: true, message: 'Comment deleted', data: { id: commentId } });
      } catch (error) {
        return fail(res, error);
      }
    },
  };
}
