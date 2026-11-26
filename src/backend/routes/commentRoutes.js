import { Router, json } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createCommentController } from '../controllers/commentController.js';
import { commentRepository } from '../repositories/commentRepository.js';
import { findSongById } from '../repositories/songRepository.js';

// Group 040, Feature 046: song comments, mounted at /api/v1.
// GET is public; with a token the response also says which comments the viewer may delete.
export function createCommentRouter({
  repository = commentRepository,
  findSong = findSongById,
  authenticate = authenticateToken,
} = {}) {
  const controller = createCommentController({ repository, findSong });
  const optionalAuth = (req, res, next) => (/^Bearer\s+\S+/i.test(req.headers.authorization || '') ? authenticate(req, res, next) : next());
  const router = Router();
  router.get('/songs/:id/comments', optionalAuth, controller.list);
  router.post('/songs/:id/comments', json({ limit: '4kb' }), authenticate, controller.create);
  router.delete('/comments/:id', authenticate, controller.remove);
  return router;
}

export default createCommentRouter();
