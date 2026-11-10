
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { receiveMedia } from '../middleware/mediaUploadMiddleware.js';
import {
  uploadAudio,
  uploadImage
} from '../controllers/mediaController.js';

const router = Router();

function requireArtistOrAdmin(req, res, next) {
  if (!['artist', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Artist or Admin role required'
    });
  }

  next();
}

router.use(authenticateToken);
router.use(requireArtistOrAdmin);

router.post('/audio', receiveMedia, uploadAudio);
router.post('/image', receiveMedia, uploadImage);

export default router;
