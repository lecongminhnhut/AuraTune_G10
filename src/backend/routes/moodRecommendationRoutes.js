import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as moodRecommendationController from '../controllers/moodRecommendationController.js';

const router = express.Router();

/**
 * GET /api/v1/recommendations/mood-context/tags
 * Returns 8 curated preset tags taxonomy
 */
router.get('/tags', authenticateToken, moodRecommendationController.getMoodContextTags);

/**
 * GET /api/v1/recommendations/mood-context
 * Returns recommendations for selected tag
 */
router.get('/', authenticateToken, moodRecommendationController.getMoodContextRecommendations);

export default router;
