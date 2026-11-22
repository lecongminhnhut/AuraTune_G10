import { Router, json } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createHistoryController } from '../controllers/historyController.js';
import { listeningHistoryRepository } from '../repositories/listeningHistoryRepository.js';
import { findSongById, findSongsByIds } from '../repositories/songRepository.js';

// Group 040 (041-FR-014): play events of the signed-in listener, mounted at /api/v1/users/me/history.
export function createHistoryRouter({
  repository = listeningHistoryRepository,
  findSong = findSongById,
  findSongs = findSongsByIds,
  authenticate = authenticateToken,
} = {}) {
  const controller = createHistoryController({ repository, findSong, findSongs });
  const router = Router();
  router.use(json({ limit: '4kb' }));
  router.use(authenticate);
  router.get('/', controller.list);
  router.post('/', controller.record);
  router.patch('/:entryId', controller.updateListened);
  router.delete('/', controller.clear);
  return router;
}

export default createHistoryRouter();
