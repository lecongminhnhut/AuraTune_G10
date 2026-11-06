import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db.js';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production');
}
export const JWT_SECRET = process.env.JWT_SECRET || 'local-development-only-change-me';
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;
export const MAX_CONCURRENT_SESSIONS = 5;
export const GRACE_PERIOD_SECONDS = 60;
export const INACTIVITY_DAYS = 7;
export const REMEMBER_ME_DAYS = 30;

export function hashToken(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateAccessToken(user, sessionId) {
  return jwt.sign(
    {
      user_id: user.user_id || user.id,
      email: user.email,
      role: user.role,
      session_id: sessionId
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

export function setRefreshTokenCookie(res, refreshToken, days = INACTIVITY_DAYS) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  res.cookie('auratune_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
    expires
  });
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie('auratune_refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth'
  });
}

export function checkPasswordStrength(password) {
  const val = password || '';
  const checks = {
    minLength: val.length >= 8,
    hasUpper: /[A-Z]/.test(val),
    hasLower: /[a-z]/.test(val),
    hasDigit: /\d/.test(val),
    hasSpecial: /[^A-Za-z0-9]/.test(val)
  };
  const isStrong = Object.values(checks).every(Boolean);
  return { isStrong, checks };
}

export function createNewSession(userId, req, rememberMe = false) {
  const activeSessions = db.getActiveUserSessions(userId);
  if (activeSessions.length >= MAX_CONCURRENT_SESSIONS) {
    activeSessions.sort((a, b) => new Date(a.last_active_at) - new Date(b.last_active_at));
    const oldest = activeSessions[0];
    if (oldest) {
      oldest.is_revoked = true;
    }
  }

  const sessionId = `sess_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);

  const now = new Date();
  const durationDays = rememberMe ? REMEMBER_ME_DAYS : INACTIVITY_DAYS;
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  const inactiveAt = new Date(now.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const deviceInfo = req.headers['user-agent'] || 'Browser Application';
  const ipAddress = req.ip || req.socket?.remoteAddress || '127.0.0.1';

  const sessionObj = {
    session_id: sessionId,
    user_id: userId,
    refresh_token_hash: tokenHash,
    previous_token_hash: null,
    grace_expires_at: null,
    device_info: deviceInfo,
    ip_address: ipAddress,
    remember_me: rememberMe,
    is_revoked: false,
    created_at: now.toISOString(),
    last_active_at: now.toISOString(),
    inactive_at: inactiveAt,
    expires_at: expiresAt
  };

  db.createSession(sessionObj);
  return { sessionObj, refreshToken };
}

export function formatUserResponse(user) {
  const linkedProviders = db.getOAuthLinksForUser(user.id || user.user_id).map((l) => l.provider);
  return {
    id: user.id || user.user_id,
    user_id: user.id || user.user_id,
    email: user.email,
    display_name: user.display_name,
    avatar_url: user.avatar_url || null,
    role: user.role || 'user',
    has_local_password: Boolean(user.has_local_password || user.password_hash),
    linked_providers: linkedProviders,
    created_at: user.created_at
  };
}
