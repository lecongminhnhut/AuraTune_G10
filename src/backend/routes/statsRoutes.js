import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as statsController from '../controllers/statsController.js';

const router = Router();

// GET /api/v1/users/me/stats/listening-analysis
router.get('/listening-analysis', authenticateToken, statsController.getListeningAnalysis);

export default router;
