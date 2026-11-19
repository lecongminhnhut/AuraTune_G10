import { randomUUID } from 'node:crypto';
import { supabase } from '../../database/supabaseClient.js';
import { demoSongs } from '../data/demoSongs.js';

const MISSING_SONG_SCHEMA = new Set(['42P01', '42703', 'PGRST200', 'PGRST205']);
const playableSong = (song) => song && song.is_active !== false && !song.deleted_at && !['restricted', 'inactive', 'unavailable', 'deleted', 'hidden'].includes(String(song.status || '').toLowerCase());

const missingDb = () => Object.assign(new Error('Playlist storage is not configured.'), { code: 'STORAGE_UNAVAILABLE' });
const requireDb = () => { if (!supabase) throw missingDb(); return supabase; };

export const playlistRepository = {
  async listOwned(userId) {
    const { data, error } = await requireDb().from('playlists').select('*').eq('user_id_creator', userId).eq('is_official', false).order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async listPublic() {
    const { data, error } = await requireDb().from('playlists').select('*').eq('status', 'Public').order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async listLibrary(userId) {
    const db = requireDb();
    const [owned, shared, saved] = await Promise.all([
      db.from('playlists').select('*').eq('user_id_creator', userId).eq('is_official', false),
      db.from('playlist_shared_users').select('playlist_id, playlists(*)').eq('shared_with_user_id', userId),
      db.from('playlist_bookmarks').select('playlist_id, playlists(*)').eq('user_id', userId),
    ]);
    for (const result of [owned, shared, saved]) if (result.error) throw result.error;
    const rows = [...(owned.data || []), ...(shared.data || []).map((row) => row.playlists).filter(Boolean), ...(saved.data || []).map((row) => row.playlists?.status === 'Public' ? ({ ...row.playlists, isBookmarked: true }) : null).filter(Boolean)];
    const byId = new Map();
    for (const row of rows) byId.set(row.id, { ...byId.get(row.id), ...row, isBookmarked: Boolean(byId.get(row.id)?.isBookmarked || row.isBookmarked) });
    return [...byId.values()];
  },
  async findById(id) {
    const { data, error } = await requireDb().from('playlists').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async getSongs(id) {
    const db = requireDb();
    const { data: links, error } = await db.from('playlist_songs').select('song_id, sort_order, added_by_user_id, added_at').eq('playlist_id', id).order('sort_order');
    if (error) throw error;
    const ids = (links || []).map((link) => link.song_id);
    if (!ids.length) return [];
    const { data: songs, error: songsError } = await db.from('songs').select('*').in('song_id', ids);
    if (songsError && !MISSING_SONG_SCHEMA.has(songsError.code)) throw songsError;
    const catalogSongs = songsError ? demoSongs.filter((song) => ids.includes(String(song.song_id))) : (songs || []);
    const byId = new Map(catalogSongs.map((song) => [String(song.song_id), song]));
    const contributorIds = [...new Set((links || []).map((link) => link.added_by_user_id).filter(Boolean))];
    let contributors = new Map();
    if (contributorIds.length) {
      const result = await db.from('users').select('id, display_name, avatar_url').in('id', contributorIds);
      if (result.error) throw result.error;
      contributors = new Map((result.data || []).map((user) => [user.id, user]));
    }
    return (links || []).map((link) => ({ ...byId.get(String(link.song_id)), ...link, added_by: contributors.get(link.added_by_user_id) || null })).filter((song) => song.song_id && playableSong(song));
  },
  async create(userId, payload) {
    const id = randomUUID();
    const row = { id, user_id_creator: userId, title: payload.title.trim(), description: payload.description?.trim() || '', cover_url: payload.coverUrl || null, cover_key: payload.cover || 'aurora', status: 'Private', is_official: false, is_collaborative: false };
    const { data, error } = await requireDb().from('playlists').insert(row).select('*').single();
    if (error) throw error;
    return data;
  },
  async update(id, patch) {
    const { data, error } = await requireDb().from('playlists').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  },
  async delete(id) {
    const { error } = await requireDb().from('playlists').delete().eq('id', id);
    if (error) throw error;
  },
  async isCollaborator(id, userId) {
    const { data, error } = await requireDb().from('playlist_shared_users').select('playlist_id').eq('playlist_id', id).eq('shared_with_user_id', userId).maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
  async addSongs(id, userId, songIds) {
    const db = requireDb();
    const existing = await db.from('playlist_songs').select('song_id, sort_order').eq('playlist_id', id).order('sort_order');
    if (existing.error) throw existing.error;
    const current = existing.data || [];
    const seen = new Set(current.map((row) => String(row.song_id)));
    const additions = [...new Set(songIds.map(String))].filter((songId) => !seen.has(songId));
    if (!additions.length) return { added: 0 };
    const valid = await db.from('songs').select('*').in('song_id', additions);
    if (valid.error && !MISSING_SONG_SCHEMA.has(valid.error.code)) throw valid.error;
    const validIds = new Set((valid.error ? demoSongs.filter((song) => additions.includes(String(song.song_id))) : (valid.data || []).filter(playableSong)).map((song) => String(song.song_id)));
    const rows = additions.filter((songId) => validIds.has(songId)).map((songId, index) => ({ playlist_id: id, song_id: songId, sort_order: current.length + index, added_by_user_id: userId }));
    if (!rows.length) return { added: 0 };
    const { error } = await db.from('playlist_songs').insert(rows);
    if (error) throw error;
    return { added: rows.length };
  },
  async removeSong(id, songId) {
    const db = requireDb();
    const { error } = await db.from('playlist_songs').delete().eq('playlist_id', id).eq('song_id', songId);
    if (error) throw error;
    const { data, error: readError } = await db.from('playlist_songs').select('song_id').eq('playlist_id', id).order('sort_order');
    if (readError) throw readError;
    for (const [index, row] of (data || []).entries()) {
      const result = await db.from('playlist_songs').update({ sort_order: index }).eq('playlist_id', id).eq('song_id', row.song_id);
      if (result.error) throw result.error;
    }
  },
  async reorder(id, ids) {
    const { error } = await requireDb().rpc('reorder_playlist_songs', { p_playlist_id: id, p_song_ids: ids.map(String) });
    if (error) throw error;
  },
};
