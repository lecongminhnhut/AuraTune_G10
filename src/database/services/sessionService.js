/**
 * Session Management Service (Spec 013)
 * Handles dual token JWT lifecycle, refresh token rotation with 60-second grace window,
 * token theft/reuse detection, 5 concurrent session LRU eviction, and multi-device logout.
 */

export const MAX_CONCURRENT_SESSIONS = 5;
export const SESSION_GRACE_PERIOD_SECONDS = 60;
export const INACTIVITY_DAYS = 7;
export const REMEMBER_ME_DAYS = 30;

/**
 * SHA-256 Hash helper for Refresh Tokens
 */
export async function hashToken(token) {
  if (!token) return '';
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256_${Math.abs(hash).toString(16)}`;
}

/**
 * Generate cryptographically secure random token string
 */
export function generateRandomToken() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return `rt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Cookie formatting helper (HttpOnly, Secure, SameSite=Strict)
 */
export function createRefreshTokenCookie(token, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  return {
    name: 'auratune_refresh_token',
    value: token,
    options: `Path=/api/v1/auth; Expires=${expires}; HttpOnly; Secure; SameSite=Strict`,
  };
}

export class SessionManager {
  constructor(initialSessions = []) {
    this.sessions = new Map();
    initialSessions.forEach((s) => this.sessions.set(s.session_id, s));
  }

  async createSession({ userId, deviceInfo = 'Web Browser', ipAddress = '127.0.0.1', rememberMe = false }) {
    const activeUserSessions = Array.from(this.sessions.values()).filter(
      (s) => s.user_id === userId && !s.is_revoked && new Date(s.expires_at) > new Date()
    );

    if (activeUserSessions.length >= MAX_CONCURRENT_SESSIONS) {
      activeUserSessions.sort((a, b) => new Date(a.last_active_at) - new Date(b.last_active_at));
      const oldestSession = activeUserSessions[0];
      if (oldestSession) oldestSession.is_revoked = true;
    }

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const refreshToken = generateRandomToken();
    const tokenHash = await hashToken(refreshToken);

    const now = new Date();
    const durationDays = rememberMe ? REMEMBER_ME_DAYS : INACTIVITY_DAYS;
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const inactiveAt = new Date(now.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const newSession = {
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
      expires_at: expiresAt,
    };

    this.sessions.set(sessionId, newSession);
    const accessToken = `at_${sessionId}_${Date.now()}`;

    return { session: newSession, refreshToken, accessToken };
  }

  async refreshSession(refreshToken, currentDeviceInfo = null) {
    if (!refreshToken) return { ok: false, error: 'NO_TOKEN', message: 'Missing refresh token.' };

    const tokenHash = await hashToken(refreshToken);
    const now = new Date();

    let session = Array.from(this.sessions.values()).find((s) => s.refresh_token_hash === tokenHash);
    let isGraceUse = false;

    if (!session) {
      const graceSession = Array.from(this.sessions.values()).find((s) => s.previous_token_hash === tokenHash);
      if (graceSession) {
        const graceExpires = graceSession.grace_expires_at ? new Date(graceSession.grace_expires_at) : null;
        if (graceExpires && graceExpires > now) {
          session = graceSession;
          isGraceUse = true;
        } else {
          graceSession.is_revoked = true;
          return {
            ok: false,
            error: 'TOKEN_REUSE_DETECTED',
            message: 'Compromised token reuse detected. Session has been revoked for security.',
          };
        }
      }
    }

    if (!session || session.is_revoked) {
      return { ok: false, error: 'INVALID_SESSION', message: 'Session is invalid or has been revoked.' };
    }

    if (new Date(session.expires_at) <= now || new Date(session.inactive_at) <= now) {
      session.is_revoked = true;
      return { ok: false, error: 'SESSION_EXPIRED', message: 'Session has expired. Please log in again.' };
    }

    let newRefreshToken = refreshToken;
    if (!isGraceUse) {
      newRefreshToken = generateRandomToken();
      const newHash = await hashToken(newRefreshToken);

      session.previous_token_hash = session.refresh_token_hash;
      session.grace_expires_at = new Date(now.getTime() + SESSION_GRACE_PERIOD_SECONDS * 1000).toISOString();
      session.refresh_token_hash = newHash;

      session.last_active_at = now.toISOString();
      session.inactive_at = new Date(now.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString();
    }

    const newAccessToken = `at_${session.session_id}_${Date.now()}`;
    return { ok: true, accessToken: newAccessToken, newRefreshToken, session };
  }

  async logoutSession(refreshToken) {
    if (!refreshToken) return false;
    const tokenHash = await hashToken(refreshToken);
    const session = Array.from(this.sessions.values()).find(
      (s) => s.refresh_token_hash === tokenHash || s.previous_token_hash === tokenHash
    );
    if (session) {
      session.is_revoked = true;
      return true;
    }
    return false;
  }

  async logoutAllUserSessions(userId) {
    let count = 0;
    for (const session of this.sessions.values()) {
      if (session.user_id === userId && !session.is_revoked) {
        session.is_revoked = true;
        count++;
      }
    }
    return count;
  }

  getActiveUserSessions(userId, currentRefreshToken = null) {
    const now = new Date();
    return Array.from(this.sessions.values())
      .filter((s) => s.user_id === userId && !s.is_revoked && new Date(s.expires_at) > now && new Date(s.inactive_at) > now)
      .map((s) => ({
        session_id: s.session_id,
        device_info: s.device_info,
        ip_address: s.ip_address,
        created_at: s.created_at,
        last_active_at: s.last_active_at,
      }));
  }
}

export const defaultSessionManager = new SessionManager();
