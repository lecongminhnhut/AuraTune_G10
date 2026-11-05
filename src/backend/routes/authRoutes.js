import { Router } from 'express';
import {
  forgotPassword,
  getMe,
  getSessions,
  login,
  logout,
  logoutAll,
  oauthCallback,
  oauthLogin,
  oauthUnlink,
  refreshSession,
  register,
  resetPassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Local Auth Endpoints (011)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OAuth Auth Endpoints (012)
router.post('/oauth/login', oauthLogin);
router.post('/oauth/callback', oauthCallback);
router.post('/oauth/unlink', authenticateToken, oauthUnlink);

// Session Management Endpoints (013)
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/sessions', authenticateToken, getSessions);
router.get('/me', authenticateToken, getMe);

export default router;
