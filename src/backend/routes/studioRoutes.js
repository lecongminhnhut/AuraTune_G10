import {Router} from 'express';
import {authenticateStudioToken} from '../middleware/authMiddleware.js';
import {createArtistTrackRepository} from '../repositories/artistTrackRepository.js';
import {createArtistTrackService} from '../services/artistTrackService.js';
import {createArtistTrackController} from '../controllers/artistTrackController.js';
export function createStudioRouter(repository=createArtistTrackRepository()) {
  const router=Router();const service=createArtistTrackService(repository);
  router.get('/me',authenticateStudioToken,createArtistTrackController(service,'identity'));
  router.get('/me/tracks',authenticateStudioToken,createArtistTrackController(service,'catalog'));
  router.get('/me/stats',authenticateStudioToken,createArtistTrackController(service,'stats'));
  return router;
}
export default createStudioRouter();
