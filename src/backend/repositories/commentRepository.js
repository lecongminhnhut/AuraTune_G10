import { supabase as defaultClient } from '../../database/supabaseClient.js';

// Group 040, Feature 046: song comments stored in Supabase `song_comments`
// (comment_id, song_id -> songs, user_id -> users, content, created_at; migration 009).
// Rows come back with the API name `id` and the author embedded from `users`.
// No in-memory fallback: without the database or the table the API answers 503.

const COLUMNS = 'id:comment_id, song_id, user_id, content, created_at, author:users(user_id, name, display_name, avatar_url)';
// Table not created yet (migration 009 not applied) or not in the PostgREST schema cache.
const MISSING_TABLE_CODES = new Set(['42P01', 'PGRST205']);

export class CommentStorageUnavailableError extends Error {
  constructor(cause) {
    super('Comment storage is not available.');
    this.name = 'CommentStorageUnavailableError';
    this.cause = cause;
  }
}

const check = ({ data, error }) => {
  if (!error) return data;
  if (MISSING_TABLE_CODES.has(error.code)) throw new CommentStorageUnavailableError(error);
  throw error;
};

export function createCommentRepository(client = defaultClient) {
  const table = () => {
    if (!client) throw new CommentStorageUnavailableError();
    return client.from('song_comments');
  };

  return {
    // Newest first. Reads one extra row so the caller can tell whether older comments exist.
    async listBySong(songId, limit) {
      const rows = check(await table()
        .select(COLUMNS)
        .eq('song_id', songId)
        .order('comment_id', { ascending: false })
        .limit(limit + 1));
      return { rows: (rows ?? []).slice(0, limit), hasMore: (rows ?? []).length > limit };
    },

    async insert({ songId, userId, content }) {
      return check(await table()
        .insert({ song_id: songId, user_id: userId, content })
        .select(COLUMNS)
        .single());
    },

    async findById(commentId) {
      return check(await table()
        .select('id:comment_id, song_id, user_id')
        .eq('comment_id', commentId)
        .maybeSingle());
    },

    async remove(commentId) {
      const rows = check(await table()
        .delete()
        .eq('comment_id', commentId)
        .select('comment_id'));
      return (rows ?? []).length > 0;
    },
  };
}

export const commentRepository = createCommentRepository();
