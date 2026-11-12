import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { handle, operations } from '../controllers/playlistController.js';

const router = Router();
const run = (operation, { auth = true, status, message } = {}) => (req, res) => {
  req.operation = operation;
  if (status) req.successStatus = status;
  if (message) req.successMessage = message;
  return handle(req, res);
};
const auth = (req, res, next) => authenticateToken(req, res, next);

router.get('/users/me/playlists', auth, run(operations.list));
router.get('/playlists', run(operations.publicList));
router.get('/users/me/liked-songs', auth, run(operations.liked));
router.post('/playlists', auth, run(operations.create, { status: 201 }));
router.get('/playlists/:id', run(operations.get, { auth: false }));
router.put('/playlists/:id', auth, run(operations.update));
router.delete('/playlists/:id', auth, run(operations.remove));
router.post('/playlists/:id/songs', auth, run(operations.addSongs));
router.delete('/playlists/:id/songs/:songId', auth, run(operations.removeSong));
router.put('/playlists/:id/songs/order', auth, run(operations.reorderSongs));
router.put('/songs/:songId/like', auth, run(operations.like));
router.delete('/songs/:songId/like', auth, run(operations.unlike));
router.put('/playlists/:id/bookmark', auth, run(operations.bookmark));
router.put('/playlists/:id/collaboration', auth, run(operations.collaboration));
router.post('/playlists/:id/collaborators', auth, run(operations.invite, { status: 201 }));
router.delete('/playlists/:id/collaborators/:userId', auth, run(operations.removeCollaborator));
router.post('/playlists/ai-generate', auth, run(operations.generate));

export default router;
