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
import { linkFacebook } from '../controllers/firebaseExchangeController.js';
import { passwordRecoveryRateLimit } from '../middleware/passwordRecoveryRateLimit.js';

const router = Router();

// Local Auth Endpoints (011)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', passwordRecoveryRateLimit({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
  message: 'Bạn đã yêu cầu quá nhiều email khôi phục. Hãy đợi một lúc rồi thử lại.'
}), forgotPassword);
router.post('/reset-password', passwordRecoveryRateLimit({
  maxRequests: 20,
  windowMs: 15 * 60 * 1000,
  message: 'Bạn đã thử đặt lại mật khẩu quá nhiều lần. Hãy đợi một lúc rồi thử lại.'
}), resetPassword);

// OAuth Auth Endpoints (012)
router.post('/oauth/login', oauthLogin);
router.post('/oauth/callback', oauthCallback);
router.post('/oauth/unlink', authenticateToken, oauthUnlink);
router.post('/oauth/link-facebook', authenticateToken, linkFacebook);

// Session Management Endpoints (013)
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/sessions', authenticateToken, getSessions);
router.get('/me', authenticateToken, getMe);

export default router;
