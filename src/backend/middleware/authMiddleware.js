
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/authHelpers.js';
import { db } from '../repositories/authRepository.js';

export async function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization || '';
  const match = /^Bearer\s+(\S+)$/i.exec(authorization);

  if (!match) {
    return res.status(401).json({
      status: 'error',
      message: 'Access Token is required'
    });
  }

  let payload;

  try {
    payload = jwt.verify(match[1], JWT_SECRET, {
      algorithms: ['HS256']
    });
  } catch {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired Access Token'
    });
  }

  const userId = payload.user_id;
  const sessionId = payload.session_id;

  if (!userId || !sessionId) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid Access Token payload'
    });
  }

  let session;
  let user;
  try {
    session = await db.findSessionById(sessionId);
    user = await db.findUserById(userId);
  } catch (error) {
    console.error('Authentication database lookup failed:', error.message);
    return res.status(503).json({ status: 'error', message: 'Authentication storage is unavailable.' });
  }

  if (
    !session ||
    session.user_id !== userId ||
    session.is_revoked ||
    session.device_info !== req.headers['user-agent'] ||
    Date.now() >= Date.parse(session.expires_at) ||
    Date.now() >= Date.parse(session.inactive_at)
  ) {
    return res.status(401).json({
      status: 'error',
      message: 'Session is invalid, expired or revoked'
    });
  }

  if (!user || user.is_banned) {
    return res.status(401).json({
      status: 'error',
      message: 'Account is unavailable'
    });
  }

  req.user = {
    ...payload,
    role: user.role
  };

  next();
}
