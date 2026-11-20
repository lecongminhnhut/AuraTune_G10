import { Router } from 'express';
import { createArtistRepository, isArtistId } from '../repositories/artistRepository.js';
import { artistError, getArtistProfile } from '../controllers/artistController.js';
import { authenticateFollowToken } from '../middleware/authMiddleware.js';
import { createFollowArtistRepository } from '../repositories/followArtistRepository.js';
import { createFollowArtistService } from '../services/followArtistService.js';
import { createFollowArtistController } from '../controllers/followArtistController.js';

export function createArtistRouter(repository = createArtistRepository(), followRepository = createFollowArtistRepository()) {
  const router = Router();
  const follow = createFollowArtistController(createFollowArtistService(followRepository));
  router.put('/:id/follow', authenticateFollowToken, follow);
  router.delete('/:id/follow', authenticateFollowToken, follow);
  // Only public GET paths. Do not gate future personal follow DELETE by visibility.
  router.get(['/:id', '/:id/songs', '/:id/albums', '/:id/playlists'], async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!isArtistId(req.params.id)) return artistError(res, 400, 'VALIDATION_ERROR', 'Invalid Artist ID');
    try {
      req.publicArtist = await repository.findPublicArtistById(req.params.id);
      if (!req.publicArtist) return artistError(res, 404, 'NOT_FOUND', 'Artist not found');
      return next();
    } catch {
      return artistError(res, 500, 'INTERNAL_ERROR', 'Artist profile temporarily unavailable');
    }
  });
  router.get('/:id', getArtistProfile);
  // Content producers are not implemented by identity-first delivery. After
  // parent checks, those requests fall through to the ordinary route fallback.
  // No placeholder arrays, fake successful sections or personalized fields.
  router.use((error, req, res, next) => {
    if (error instanceof URIError) {
      res.set('Cache-Control', ['PUT','DELETE'].includes(req.method) ? 'private, no-store' : 'no-store');
      return artistError(res, 400, 'VALIDATION_ERROR', 'Invalid Artist ID');
    }
    return next(error);
  });
  return router;
}

export default createArtistRouter();
