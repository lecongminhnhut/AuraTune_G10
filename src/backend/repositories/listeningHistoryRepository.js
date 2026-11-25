import { supabase as defaultClient } from '../../database/supabaseClient.js';

// Group 040 (041-FR-014): play events stored in Supabase `listening_history`
// (history_id, user_id, song_id, played_at, duration_listened — team ER design).
// Rows are returned with the API names `id` and `listened_duration`.
// No in-memory fallback: when the database is not configured the API answers 503.

const COLUMNS = 'id:history_id, user_id, song_id, listened_duration:duration_listened, played_at';

export class HistoryStorageUnavailableError extends Error {
  constructor() {
    super('Listening history storage is not configured.');
    this.name = 'HistoryStorageUnavailableError';
  }
}

export function createListeningHistoryRepository(client = defaultClient) {
  const table = () => {
    if (!client) throw new HistoryStorageUnavailableError();
    return client.from('listening_history');
  };

  return {
    async insert({ userId, songId, listenedSeconds, playedAt = new Date() }) {
      const { data, error } = await table()
        .insert({ user_id: userId, song_id: songId, duration_listened: listenedSeconds, played_at: playedAt.toISOString() })
        .select(COLUMNS)
        .single();
      if (error) throw error;
      return data;
    },

    // Listened time only grows within a session; the row must belong to the user.
    async raiseListened({ userId, id, listenedSeconds }) {
      const { data, error } = await table()
        .update({ duration_listened: listenedSeconds })
        .eq('history_id', id)
        .eq('user_id', userId)
        .or(`duration_listened.is.null,duration_listened.lt.${listenedSeconds}`)
        .select(COLUMNS)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
      const existing = await table().select(COLUMNS).eq('history_id', id).eq('user_id', userId).maybeSingle();
      if (existing.error) throw existing.error;
      return existing.data;
    },

    async listRecent(userId, limit) {
      const { data, error } = await table()
        .select(COLUMNS)
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },

    async clear(userId) {
      const { error, count } = await table().delete({ count: 'exact' }).eq('user_id', userId);
      if (error) throw error;
      return count ?? 0;
    },
  };
}

export const listeningHistoryRepository = createListeningHistoryRepository();
