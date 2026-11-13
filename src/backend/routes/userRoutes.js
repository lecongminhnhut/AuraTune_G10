import { Router } from 'express';
import { authenticateFollowToken } from '../middleware/authMiddleware.js';
import { createFollowArtistRepository } from '../repositories/followArtistRepository.js';
import { createFollowArtistService } from '../services/followArtistService.js';
import { createFollowArtistController } from '../controllers/followArtistController.js';
export function createUserRouter(repository=createFollowArtistRepository()) {
  const router=Router();
  router.get('/me/following-artists',authenticateFollowToken,createFollowArtistController(createFollowArtistService(repository)));
  return router;
}
export default createUserRouter();
