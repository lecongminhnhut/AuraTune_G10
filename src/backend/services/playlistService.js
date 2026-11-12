import { supabase } from '../../database/supabaseClient.js';
import { demoSongs } from '../data/demoSongs.js';
import { playlistRepository as repo } from '../repositories/playlistRepository.js';
import { getPlaylistGeneration } from '../clients/aiServiceClient.js';

const fail = (status, code, message) => Object.assign(new Error(message), { status, code });
const minutes = (song) => Number(song.duration ?? song.duration_seconds ?? 0) || 0;
const normalize = (row, songs = [], owner = null) => ({
  id: String(row.id), title: row.title ?? row.name ?? '', description: row.description || '',
  coverUrl: row.cover_url || null, cover: row.cover_key || 'aurora', status: row.status || 'Private', ownerId: row.user_id_creator, isBookmarked: Boolean(row.isBookmarked),
  owner: owner?.display_name || 'AuraTune listener', isCollaborative: Boolean(row.is_collaborative),
  collaborators: row.collaborators || [], songs, trackIds: songs.map((song) => String(song.song_id)),
  count: songs.length, duration: songs.reduce((sum, song) => sum + minutes(song), 0),
  createdAt: row.created_at, updatedAt: row.updated_at,
});

async function loadOwner(userId) {
  if (!supabase || !userId) return null;
  const { data } = await supabase.from('users').select('id, display_name').eq('id', userId).maybeSingle();
  return data;
}

export async function listLibrary(userId) {
  const playlists = await repo.listLibrary(userId);
  return Promise.all(playlists.map(async (row) => normalize(row, await repo.getSongs(row.id), await loadOwner(row.user_id_creator))));
}

export async function listPublicPlaylists() {
  const rows = await repo.listPublic();
  return Promise.all(rows.map(async (row) => normalize(row, await repo.getSongs(row.id), await loadOwner(row.user_id_creator))));
}

export async function getPlaylist(id, userId = null) {
  const row = await repo.findById(id);
  if (!row || row.is_official) throw fail(404, 'NOT_FOUND', 'Playlist not found.');
  const owner = row.user_id_creator === userId;
  const collab = userId ? await repo.isCollaborator(id, userId) : false;
  if (row.status !== 'Public' && !owner && !collab) throw fail(404, 'NOT_FOUND', 'Playlist not found.');
  const [songs, members, saved] = await Promise.all([
    repo.getSongs(id),
    supabase.from('playlist_shared_users').select(owner ? 'shared_with_user_id, users!playlist_shared_users_shared_with_user_id_fkey(id, email, display_name, avatar_url)' : 'shared_with_user_id, users!playlist_shared_users_shared_with_user_id_fkey(id, display_name, avatar_url)').eq('playlist_id', id),
    userId ? supabase.from('playlist_bookmarks').select('playlist_id').eq('user_id', userId).eq('playlist_id', id).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  if (members.error) throw members.error;
  if (saved.error) throw saved.error;
  const collaborators = (members.data || []).map((member) => ({ ...member.users, id: member.shared_with_user_id }));
  return normalize({ ...row, collaborators, isBookmarked: Boolean(saved.data) }, songs, await loadOwner(row.user_id_creator));
}

export async function createPlaylist(userId, input) {
  if (!input || typeof input.title !== 'string' || !input.title.trim() || input.title.trim().length > 80 || (input.description ?? '').length > 300) throw fail(400, 'VALIDATION_ERROR', 'Playlist name and description are invalid.');
  return normalize(await repo.create(userId, input), [], await loadOwner(userId));
}

async function owned(id, userId) {
  const row = await repo.findById(id);
  if (!row || row.is_official) throw fail(404, 'NOT_FOUND', 'Playlist not found.');
  if (row.user_id_creator !== userId) throw fail(403, 'FORBIDDEN', 'Only the playlist owner can perform this action.');
  return row;
}

export async function updatePlaylist(id, userId, input) {
  await owned(id, userId);
  const patch = {};
  if ('title' in input) {
    if (typeof input.title !== 'string' || !input.title.trim() || input.title.trim().length > 80) throw fail(400, 'VALIDATION_ERROR', 'Playlist name must be between 1 and 80 characters.');
    patch.title = input.title.trim();
  }
  if ('description' in input) {
    if (typeof input.description !== 'string' || input.description.length > 300) throw fail(400, 'VALIDATION_ERROR', 'Description must be at most 300 characters.');
    patch.description = input.description.trim();
  }
  if ('coverUrl' in input) patch.cover_url = input.coverUrl || null;
  if ('cover' in input) patch.cover_key = input.cover || 'aurora';
  if ('status' in input) {
    if (!['Public', 'Private'].includes(input.status)) throw fail(400, 'VALIDATION_ERROR', 'Status must be Public or Private.');
    patch.status = input.status;
  }
  return normalize(await repo.update(id, patch), await repo.getSongs(id), await loadOwner(userId));
}

export async function deletePlaylist(id, userId) { await owned(id, userId); await repo.delete(id); }

export async function authorizeTrackEdit(id, userId) {
  const row = await repo.findById(id);
  if (!row || row.is_official) throw fail(404, 'NOT_FOUND', 'Playlist not found.');
  if (row.user_id_creator === userId || await repo.isCollaborator(id, userId)) return row;
  throw fail(403, 'FORBIDDEN', 'You cannot edit this playlist.');
}

export async function addSongs(id, userId, ids) {
  if (!Array.isArray(ids) || !ids.length || ids.length > 100) throw fail(400, 'VALIDATION_ERROR', 'Provide between 1 and 100 song IDs.');
  await authorizeTrackEdit(id, userId);
  await repo.addSongs(id, userId, ids);
  return getPlaylist(id, userId);
}
export async function removeSong(id, userId, songId) { await authorizeTrackEdit(id, userId); await repo.removeSong(id, songId); return getPlaylist(id, userId); }
export async function reorderSongs(id, userId, ids) {
  await authorizeTrackEdit(id, userId);
  if (!Array.isArray(ids)) throw fail(400, 'VALIDATION_ERROR', 'songIds must be an array.');
  await repo.reorder(id, ids);
  return getPlaylist(id, userId);
}

export async function setLiked(userId, songId, liked) {
  const db = supabase;
  if (!db) throw fail(503, 'INTERNAL_ERROR', 'Playlist storage is not configured.');
  const result = liked
    ? await db.from('user_liked_songs').upsert({ user_id: userId, song_id: songId }, { onConflict: 'user_id,song_id', ignoreDuplicates: true })
    : await db.from('user_liked_songs').delete().eq('user_id', userId).eq('song_id', songId);
  if (result.error) throw result.error;
  return listLiked(userId);
}
export async function listLiked(userId) {
  const { data, error } = await supabase.from('user_liked_songs').select('song_id').eq('user_id', userId).order('created_at');
  if (error) throw error;
  return (data || []).map((row) => row.song_id);
}

export async function bookmark(id, userId) {
  const playlist = await repo.findById(id);
  if (!playlist || playlist.status !== 'Public') throw fail(404, 'NOT_FOUND', 'Public playlist not found.');
  const result = await supabase.from('playlist_bookmarks').upsert({ user_id: userId, playlist_id: id }, { onConflict: 'user_id,playlist_id', ignoreDuplicates: true });
  if (result.error) throw result.error;
  return { saved: true };
}

export async function setCollaboration(id, userId, enabled) {
  await owned(id, userId);
  const { error } = await supabase.rpc('set_playlist_collaboration', { p_playlist_id: id, p_enabled: Boolean(enabled) });
  if (error) throw error;
  const data = await repo.findById(id);
  return normalize(data, await repo.getSongs(id), await loadOwner(userId));
}

export async function inviteCollaborator(id, userId, email) {
  await owned(id, userId);
  if (typeof email !== 'string') throw fail(400, 'VALIDATION_ERROR', 'Enter a valid email address.');
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) throw fail(400, 'VALIDATION_ERROR', 'Enter a valid email address.');
  const playlist = await repo.findById(id);
  if (!playlist?.is_collaborative) throw fail(400, 'VALIDATION_ERROR', 'Enable collaboration before inviting members.');
  const { data: target, error: lookupError } = await supabase.from('users').select('id, email, display_name, avatar_url').eq('email', normalizedEmail).maybeSingle();
  if (lookupError) throw lookupError;
  if (!target) throw fail(404, 'NOT_FOUND', 'This email does not belong to a registered AuraTune user.');
  if (target.id === userId) throw fail(400, 'VALIDATION_ERROR', 'The owner is already a playlist member.');
  const { error } = await supabase.from('playlist_shared_users').upsert({ playlist_id: id, shared_with_user_id: target.id }, { onConflict: 'playlist_id,shared_with_user_id', ignoreDuplicates: true });
  if (error) throw error;
  return target;
}
export async function removeCollaborator(id, userId, targetId) {
  await owned(id, userId);
  const { error } = await supabase.from('playlist_shared_users').delete().eq('playlist_id', id).eq('shared_with_user_id', targetId);
  if (error) throw error;
}

export async function generatePlaylist(prompt) {
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 200) throw fail(400, 'VALIDATION_ERROR', 'Prompt must be between 1 and 200 characters.');
  try {
    const response = await getPlaylistGeneration({ prompt: prompt.trim() });
    const candidates = Array.isArray(response?.tracks) ? response.tracks : [];
    const ids = [...new Set(candidates.map((track) => String(track.song_id ?? track.id ?? '')).filter(Boolean))];
    if (!ids.length) return { title: response?.title || prompt.trim().slice(0, 80), reason: response?.reason || '', tracks: [] };
    const { data: tracks, error } = await supabase.from('songs').select('*').in('song_id', ids);
    if (error && !['42P01', '42703', 'PGRST200', 'PGRST205'].includes(error.code)) throw error;
    const catalog = error ? demoSongs : tracks || [];
    const byId = new Map(catalog.filter((song) => song.is_active !== false && !song.deleted_at && !['restricted', 'inactive', 'unavailable', 'deleted', 'hidden'].includes(String(song.status || '').toLowerCase())).map((song) => [String(song.song_id), song]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
    if (ordered.length < 10) return { title: response?.title || prompt.trim().slice(0, 80), reason: response?.reason || '', tracks: [], noMatch: true };
    return { title: response?.title || prompt.trim().slice(0, 80), reason: response?.reason || '', tracks: ordered.slice(0, 20) };
  } catch (error) {
    throw fail(503, 'AI_SERVICE_UNAVAILABLE', 'AI playlist generation is temporarily unavailable.');
  }
}
