import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getAgentHealth, streamAgentChat } from '../controllers/agentController.js';

const router = Router();

// GET /api/v1/agent/health - Public health probe
router.get('/health', getAgentHealth);

// POST /api/v1/agent/chat - Protected SSE chat stream
router.post('/chat', authenticateToken, streamAgentChat);

export default router;
