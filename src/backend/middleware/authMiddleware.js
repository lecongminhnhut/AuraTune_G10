import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/authHelpers.js';
import { db } from '../repositories/authRepository.js';
import { db as memDb } from '../db.js';

export async function authenticateToken(req, res, next) {
  const isStatsRoute =
    req.baseUrl?.startsWith('/api/v1/users/me/stats') ||
    req.originalUrl?.includes('/stats') ||
    req.path?.includes('/stats');

  const isAgentRoute =
    req.baseUrl?.startsWith('/api/v1/agent') ||
    req.originalUrl?.includes('/agent') ||
    req.path?.includes('/agent');

  const isMoodRoute =
    req.baseUrl?.includes('/mood-context') ||
    req.originalUrl?.includes('/mood-context') ||
    req.path?.includes('/mood-context');

  const isRecommendationRoute =
    req.baseUrl?.startsWith('/api/v1/recommendations') ||
    req.originalUrl?.includes('/recommendations') ||
    req.path?.includes('/recommendations');

  const isPlaylistRoute =
    req.originalUrl?.startsWith('/api/v1/playlists') ||
    req.originalUrl?.startsWith('/api/v1/users/me/playlists') ||
    req.originalUrl?.startsWith('/api/v1/users/me/liked-songs') ||
    req.originalUrl?.startsWith('/api/v1/songs/');

  const sendUnauthorized = (legacyMsg) => {
    if (isMoodRoute) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập để nhận gợi ý theo tâm trạng',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          details: []
        }
      });
    }
    if (isRecommendationRoute) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập để nhận gợi ý cá nhân hóa',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          details: []
        }
      });
    }
    if (isStatsRoute) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập để truy cập thông tin phân tích',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          details: []
        }
      });
    }
    if (isAgentRoute) {
      return res.status(401).json({
        success: false,
        message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          details: []
        }
      });
    }
    if (isPlaylistRoute) {
      return res.status(401).json({ success: false, message: 'Authentication is required.', data: null, error: { code: 'UNAUTHORIZED', details: [] } });
    }
    return res.status(401).json({
      status: 'error',
      message: legacyMsg
    });
  };

  const authorization = req.headers.authorization || '';
  const match = /^Bearer\s+(\S+)$/i.exec(authorization);

  if (!match) {
    return sendUnauthorized('Access Token is required');
  }

  let payload;
  try {
    payload = jwt.verify(match[1], JWT_SECRET, {
      algorithms: ['HS256']
    });
  } catch {
    return sendUnauthorized('Invalid or expired Access Token');
  }

  const userId = payload.user_id || payload.id || payload.sub;
  const sessionId = payload.session_id;

  if (!userId) {
    return sendUnauthorized('Invalid Access Token payload');
  }

  let session;
  let user;
  try {
    if (sessionId) {
      session = (await db.findSessionById(sessionId)) || memDb.findSessionById(sessionId);
    }
    user = (await db.findUserById(userId)) || memDb.findUserById(userId);
  } catch (error) {
    console.error('Authentication database lookup failed:', error.message);
    // Fallback to in-memory lookup during network/db issues
    if (sessionId) {
      session = memDb.findSessionById(sessionId);
    }
    user = memDb.findUserById(userId);
    if (!user) {
      return res.status(503).json({ status: 'error', message: 'Authentication storage is unavailable.' });
    }
  }

  if (sessionId && session) {
    if (
      session.user_id !== userId ||
      session.is_revoked ||
      (session.device_info && req.headers['user-agent'] && session.device_info !== req.headers['user-agent']) ||
      Date.now() >= Date.parse(session.expires_at) ||
      Date.now() >= Date.parse(session.inactive_at)
    ) {
      return sendUnauthorized('Session is invalid, expired or revoked');
    }
  } else if (sessionId && !session && !isAgentRoute && !isStatsRoute && !isRecommendationRoute) {
    return sendUnauthorized('Session is invalid, expired or revoked');
  }

  if (user && user.is_banned) {
    if (isRecommendationRoute) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa',
        data: null,
        error: {
          code: 'ACCOUNT_BANNED',
          details: []
        }
      });
    }
    return sendUnauthorized('Account is unavailable');
  }

  req.user = {
    ...payload,
    id: userId,
    user_id: userId,
    role: user?.role || payload.role || 'listener'
  };

  next();
}
