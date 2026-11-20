import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { analyzeMusicIntent } from '../controllers/intentController.js';

const router = Router();

// POST /api/v1/agent/intent/analyze - Protected intent analysis endpoint
router.post('/analyze', authenticateToken, analyzeMusicIntent);

export default router;
