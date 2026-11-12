import * as service from '../services/playlistService.js';

const ok = (res, data, status = 200, message = 'Playlist request completed.') => res.status(status).json({ success: true, message, data, error: null });
export async function handle(req, res) {
  try {
    const data = await req.operation(req);
    return ok(res, data, req.successStatus || 200, req.successMessage);
  } catch (error) {
    const status = error.status || (error.code === 'STORAGE_UNAVAILABLE' ? 503 : 500);
    const code = error.code || (status === 403 ? 'FORBIDDEN' : status === 404 ? 'NOT_FOUND' : status === 503 ? 'INTERNAL_ERROR' : 'INTERNAL_ERROR');
    if (status >= 500) console.error('Playlist API failed:', error.message);
    return res.status(status).json({ success: false, message: status >= 500 ? 'Playlist service is temporarily unavailable.' : error.message, data: null, error: { code, details: [] } });
  }
}

export const operations = {
  list: (req) => service.listLibrary(req.user.id),
  publicList: () => service.listPublicPlaylists(),
  get: (req) => service.getPlaylist(req.params.id, req.user?.id),
  create: (req) => service.createPlaylist(req.user.id, req.body),
  update: (req) => service.updatePlaylist(req.params.id, req.user.id, req.body || {}),
  remove: async (req) => { await service.deletePlaylist(req.params.id, req.user.id); return { id: req.params.id }; },
  addSongs: (req) => service.addSongs(req.params.id, req.user.id, req.body?.songIds),
  removeSong: (req) => service.removeSong(req.params.id, req.user.id, req.params.songId),
  reorderSongs: (req) => service.reorderSongs(req.params.id, req.user.id, req.body?.songIds),
  liked: (req) => service.listLiked(req.user.id),
  like: (req) => service.setLiked(req.user.id, req.params.songId, true),
  unlike: (req) => service.setLiked(req.user.id, req.params.songId, false),
  bookmark: (req) => service.bookmark(req.params.id, req.user.id),
  collaboration: (req) => service.setCollaboration(req.params.id, req.user.id, req.body?.enabled),
  invite: (req) => service.inviteCollaborator(req.params.id, req.user.id, req.body?.email),
  removeCollaborator: async (req) => { await service.removeCollaborator(req.params.id, req.user.id, req.params.userId); return { removed: true }; },
  generate: (req) => service.generatePlaylist(req.body?.prompt),
};
