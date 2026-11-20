import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { executeAssistancePlan } from '../controllers/assistanceController.js';

const router = Router();

// POST /api/v1/agent/assistance/execute - Execute or coordinate real-time music assistance actions
router.post('/execute', authenticateToken, executeAssistancePlan);

export default router;
