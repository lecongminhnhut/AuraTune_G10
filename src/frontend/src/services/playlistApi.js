import { apiFetch } from './sessionApiClient.js';

async function request(path, options = {}) {
  const response = await apiFetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.message || 'Playlist service is unavailable.');
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }
  return payload?.data;
}

export const playlistApi = {
  list: () => request('/users/me/playlists'),
  get: (id) => request(`/playlists/${encodeURIComponent(id)}`),
  create: (playlist) => request('/playlists', { method: 'POST', body: JSON.stringify(playlist) }),
  update: (id, patch) => request(`/playlists/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(patch) }),
  remove: (id) => request(`/playlists/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  addSongs: (id, songIds) => request(`/playlists/${encodeURIComponent(id)}/songs`, { method: 'POST', body: JSON.stringify({ songIds }) }),
  removeSong: (id, songId) => request(`/playlists/${encodeURIComponent(id)}/songs/${encodeURIComponent(songId)}`, { method: 'DELETE' }),
  reorder: (id, songIds) => request(`/playlists/${encodeURIComponent(id)}/songs/order`, { method: 'PUT', body: JSON.stringify({ songIds }) }),
  liked: () => request('/users/me/liked-songs'),
  setLiked: (songId, liked) => request(`/songs/${encodeURIComponent(songId)}/like`, { method: liked ? 'PUT' : 'DELETE' }),
  bookmark: (id) => request(`/playlists/${encodeURIComponent(id)}/bookmark`, { method: 'PUT' }),
  setCollaboration: (id, enabled) => request(`/playlists/${encodeURIComponent(id)}/collaboration`, { method: 'PUT', body: JSON.stringify({ enabled }) }),
  invite: (id, email) => request(`/playlists/${encodeURIComponent(id)}/collaborators`, { method: 'POST', body: JSON.stringify({ email }) }),
  removeCollaborator: (id, userId) => request(`/playlists/${encodeURIComponent(id)}/collaborators/${encodeURIComponent(userId)}`, { method: 'DELETE' }),
  generate: (prompt) => request('/playlists/ai-generate', { method: 'POST', body: JSON.stringify({ prompt }) }),
};

export default playlistApi;
