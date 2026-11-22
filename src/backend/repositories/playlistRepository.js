import { supabase } from '../../database/supabaseClient.js';
import { findSongsByIds } from './songRepository.js';

// Group 060 on the shared Supabase schema (team ER design + migration 008):
//   playlists(playlist_id bigint, user_id_creator, name, status, description, cover_url, cover_key,
//             is_official, is_collaborative, created_at, updated_at)
//   playlist_songs(playlist_id, song_id bigint, sort_order, added_by_user_id, added_at)
//   playlist_shared_users(playlist_id, shared_with_user_id, shared_at), playlist_bookmarks(user_id, playlist_id)
// Rows are mapped to the service shape: `id` = playlist_id as a string, `title` = name.

const PLAYLIST_ID = /^\d{1,18}$/;
const CATALOG_SONG_ID = /^\d{1,18}$/;

export const isPlaylistId = (value) => PLAYLIST_ID.test(String(value ?? ''));
export const isCatalogSongId = (value) => CATALOG_SONG_ID.test(String(value ?? ''));

const missingDb = () => Object.assign(new Error('Playlist storage is not configured.'), { code: 'STORAGE_UNAVAILABLE' });

// Tables that reference playlists.playlist_id. The team ER schema declares these foreign keys
// without ON DELETE, so their rows are removed before the playlist itself.
export const PLAYLIST_CHILD_TABLES = ['playlist_bookmarks', 'playlist_shared_users', 'playlist_songs'];

export const fromPlaylistRow = (row) => (row ? { ...row, id: String(row.playlist_id), title: row.name ?? '' } : row);

const toColumns = (patch) => {
  const { title, ...rest } = patch;
  return title === undefined ? rest : { ...rest, name: title };
};

export function createPlaylistRepository(client = supabase) {
  const requireDb = () => { if (!client) throw missingDb(); return client; };
  return {
    async listOwned(userId) {
      const { data, error } = await requireDb().from('playlists').select('*').eq('user_id_creator', userId).eq('is_official', false).order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(fromPlaylistRow);
    },
    async listPublic() {
      const { data, error } = await requireDb().from('playlists').select('*').eq('status', 'Public').order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(fromPlaylistRow);
    },
    async listLibrary(userId) {
      const db = requireDb();
      const [owned, shared, saved] = await Promise.all([
        db.from('playlists').select('*').eq('user_id_creator', userId).eq('is_official', false),
        db.from('playlist_shared_users').select('playlist_id, playlists(*)').eq('shared_with_user_id', userId),
        db.from('playlist_bookmarks').select('playlist_id, playlists(*)').eq('user_id', userId),
      ]);
      for (const result of [owned, shared, saved]) if (result.error) throw result.error;
      const rows = [
        ...(owned.data || []),
        ...(shared.data || []).map((row) => row.playlists).filter(Boolean),
        ...(saved.data || []).map((row) => (row.playlists?.status === 'Public' ? { ...row.playlists, isBookmarked: true } : null)).filter(Boolean),
      ].map(fromPlaylistRow);
      const byId = new Map();
      for (const row of rows) byId.set(row.id, { ...byId.get(row.id), ...row, isBookmarked: Boolean(byId.get(row.id)?.isBookmarked || row.isBookmarked) });
      return [...byId.values()].sort((a, b) => String(b.updated_at ?? '').localeCompare(String(a.updated_at ?? '')));
    },
    async findById(id) {
      if (!isPlaylistId(id)) return null;
      const { data, error } = await requireDb().from('playlists').select('*').eq('playlist_id', id).maybeSingle();
      if (error) throw error;
      return fromPlaylistRow(data);
    },
    // Members in playlist order, with catalog metadata (title, artist, album) and the contributor.
    async getSongs(id) {
      const db = requireDb();
      const { data: links, error } = await db.from('playlist_songs').select('song_id, sort_order, added_by_user_id, added_at').eq('playlist_id', id).order('sort_order').order('added_at');
      if (error) throw error;
      if (!links?.length) return [];
      const catalog = await findSongsByIds(links.map((link) => String(link.song_id)));
      const contributorIds = [...new Set(links.map((link) => link.added_by_user_id).filter(Boolean))];
      let contributors = new Map();
      if (contributorIds.length) {
        const result = await db.from('users').select('user_id, display_name, avatar_url').in('user_id', contributorIds);
        if (result.error) throw result.error;
        contributors = new Map((result.data || []).map((user) => [user.user_id, { id: user.user_id, display_name: user.display_name, avatar_url: user.avatar_url }]));
      }
      return links
        .map((link) => {
          const song = catalog.get(String(link.song_id));
          if (!song || song.is_active === false) return null;
          const { audio_url: _audioUrl, source: _source, ...metadata } = song;
          return { ...metadata, song_id: String(link.song_id), sort_order: link.sort_order, added_at: link.added_at, added_by_user_id: link.added_by_user_id, added_by: contributors.get(link.added_by_user_id) || null };
        })
        .filter(Boolean);
    },
    async create(userId, payload) {
      const row = { user_id_creator: userId, name: payload.title.trim(), description: payload.description?.trim() || '', cover_url: payload.coverUrl || null, cover_key: payload.cover || 'aurora', status: 'Private', is_official: false, is_collaborative: false };
      const { data, error } = await requireDb().from('playlists').insert(row).select('*').single();
      if (error) throw error;
      return fromPlaylistRow(data);
    },
    async update(id, patch) {
      const { data, error } = await requireDb().from('playlists').update({ ...toColumns(patch), updated_at: new Date().toISOString() }).eq('playlist_id', id).select('*').single();
      if (error) throw error;
      return fromPlaylistRow(data);
    },
    async touch(id) {
      const { error } = await requireDb().from('playlists').update({ updated_at: new Date().toISOString() }).eq('playlist_id', id);
      if (error) throw error;
    },
    // Without ON DELETE CASCADE the playlist row cannot go while songs, members or bookmarks
    // still point at it (Postgres 23503), so those rows are removed first.
    async delete(id) {
      const db = requireDb();
      for (const table of PLAYLIST_CHILD_TABLES) {
        const { error } = await db.from(table).delete().eq('playlist_id', id);
        if (error) throw error;
      }
      const { error } = await db.from('playlists').delete().eq('playlist_id', id);
      if (error) throw error;
    },
    async isCollaborator(id, userId) {
      if (!isPlaylistId(id) || !userId) return false;
      const { data, error } = await requireDb().from('playlist_shared_users').select('playlist_id').eq('playlist_id', id).eq('shared_with_user_id', userId).maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
    // Appends catalog songs that are not in the playlist yet. Ids outside the database catalog
    // (for example the demo ids `t1`…`t10`) are reported as `invalid` instead of being stored.
    async addSongs(id, userId, songIds) {
      const db = requireDb();
      const existing = await db.from('playlist_songs').select('song_id, sort_order').eq('playlist_id', id).order('sort_order');
      if (existing.error) throw existing.error;
      const current = existing.data || [];
      const seen = new Set(current.map((row) => String(row.song_id)));
      const requested = [...new Set(songIds.map(String))];
      const additions = requested.filter((songId) => !seen.has(songId));
      if (!additions.length) return { added: 0, invalid: 0 };
      const catalog = await findSongsByIds(additions.filter(isCatalogSongId));
      const valid = additions.filter((songId) => isCatalogSongId(songId) && catalog.get(songId)?.source === 'database' && catalog.get(songId).is_active !== false);
      const invalid = additions.length - valid.length;
      if (!valid.length) return { added: 0, invalid };
      const nextOrder = current.reduce((max, row) => Math.max(max, Number(row.sort_order) + 1), 0);
      const rows = valid.map((songId, index) => ({ playlist_id: Number(id), song_id: Number(songId), sort_order: nextOrder + index, added_by_user_id: userId }));
      const { error } = await db.from('playlist_songs').insert(rows);
      if (error) throw error;
      await this.touch(id);
      return { added: rows.length, invalid };
    },
    async removeSong(id, songId) {
      if (!isCatalogSongId(songId)) return;
      const db = requireDb();
      const { error } = await db.from('playlist_songs').delete().eq('playlist_id', id).eq('song_id', songId);
      if (error) throw error;
      const { data, error: readError } = await db.from('playlist_songs').select('song_id, sort_order').eq('playlist_id', id).order('sort_order');
      if (readError) throw readError;
      // Close the gap from the top down; each row moves into the slot just freed, so the unique order index holds.
      for (const [index, row] of (data || []).entries()) {
        if (row.sort_order === index) continue;
        const result = await db.from('playlist_songs').update({ sort_order: index }).eq('playlist_id', id).eq('song_id', row.song_id);
        if (result.error) throw result.error;
      }
      await this.touch(id);
    },
    async reorder(id, ids) {
      if (!ids.every(isCatalogSongId)) throw Object.assign(new Error('Invalid playlist order'), { code: '22023' });
      const { error } = await requireDb().rpc('reorder_playlist_songs', { p_playlist_id: Number(id), p_song_ids: ids.map(Number) });
      if (error) throw error;
    },
  };
}

export const playlistRepository = createPlaylistRepository();
