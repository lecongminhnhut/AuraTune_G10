import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as recommendationController from '../controllers/recommendationController.js';

const router = Router();

// GET /api/v1/recommendations/personalized
router.get('/personalized', authenticateToken, recommendationController.getPersonalizedRecommendations);

// GET /api/v1/recommendations/songs (Backward-compatible alias)
router.get('/songs', authenticateToken, recommendationController.getRecommendedSongs);

export default router;
