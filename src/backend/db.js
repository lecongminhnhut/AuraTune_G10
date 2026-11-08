import bcrypt from 'bcryptjs';

// In-Memory Database with optional JSON file backup
const daysAgo = (days, hours = 0) => new Date(Date.now() - (days * 24 + hours) * 3600 * 1000).toISOString();

// Pre-seeded users as defined in spec & app state
const defaultUsers = [
  {
    id: 'u-demo',
    user_id: 'u-demo',
    email: 'demo@auratune.vn',
    display_name: 'Người nghe Demo',
    password_hash: bcrypt.hashSync('Aura1234!', 10),
    role: 'user',
    has_local_password: true,
    avatar_url: null,
    failed_login_attempts: 0,
    lockout_until: null,
    terms_accepted_at: daysAgo(30),
    created_at: daysAgo(30),
    updated_at: daysAgo(30),
    is_banned: false
  },
  {
    id: 'u-artist',
    user_id: 'u-artist',
    email: 'artist@auratune.vn',
    display_name: 'AuraTune Studio',
    password_hash: bcrypt.hashSync('Aura1234!', 10),
    role: 'artist',
    artistId: 'auratune-studio',
    has_local_password: true,
    avatar_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    failed_login_attempts: 0,
    lockout_until: null,
    terms_accepted_at: daysAgo(60),
    created_at: daysAgo(60),
    updated_at: daysAgo(60),
    is_banned: false
  },
  {
    id: 'u-admin',
    user_id: 'u-admin',
    email: 'admin@auratune.vn',
    display_name: 'Quản trị viên',
    password_hash: bcrypt.hashSync('Aura1234!', 10),
    role: 'admin',
    has_local_password: true,
    avatar_url: null,
    failed_login_attempts: 0,
    lockout_until: null,
    terms_accepted_at: daysAgo(90),
    created_at: daysAgo(90),
    updated_at: daysAgo(90),
    is_banned: false
  }
];

class Database {
  constructor() {
    this.users = [...defaultUsers];
    this.oauthLinks = []; // [{ id, user_id, provider, provider_user_id, linked_at, last_login_at }]
    this.userSessions = []; // [{ session_id, user_id, refresh_token_hash, previous_token_hash, grace_expires_at, device_info, ip_address, remember_me, is_revoked, created_at, last_active_at, inactive_at, expires_at }]
    this.passwordResetTokens = [];
  }

  findUserByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.trim().toLowerCase() === normalized) || null;
  }

  findUserById(userId) {
    return this.users.find((u) => u.id === userId || u.user_id === userId) || null;
  }

  // Find an AuraTune user by verified Firebase UID
  findUserByFirebaseUid(firebaseUid) {
    if (!firebaseUid) return null;

    const link = ['firebase', 'google', 'facebook']
      .map((provider) => this.findOAuthLink(provider, firebaseUid))
      .find(Boolean);

    if (!link) return null;

    return this.findUserById(link.user_id);
  }

  // Link a Firebase UID to an AuraTune user
  linkFirebaseUid(userId, firebaseUid) {
    if (!userId || !firebaseUid) {
      throw new Error('Missing user ID or Firebase UID');
    }

    const user = this.findUserById(userId);

    if (!user) {
      throw new Error('AuraTune user not found');
    }

    const existingUidLink = this.findOAuthLink(
      'firebase',
      firebaseUid
    );

    if (existingUidLink) {
      if (existingUidLink.user_id !== userId) {
        throw new Error('Firebase UID already linked to another user');
      }

      return existingUidLink;
    }

    const existingUserLink = this.getOAuthLinksForUser(userId)
      .find((link) => link.provider === 'firebase');

    if (existingUserLink) {
      throw new Error('AuraTune user already linked to Firebase');
    }

    return this.addOAuthLink(userId, 'firebase', firebaseUid);
  }

  createUser(userData) {
    const newUser = {
      id: userData.id || `u-${Date.now()}`,
      user_id: userData.id || `u-${Date.now()}`,
      email: userData.email.trim().toLowerCase(),
      display_name: userData.display_name,
      password_hash: userData.password_hash || null,
      role: userData.role || 'user',
      has_local_password: Boolean(userData.password_hash),
      avatar_url: userData.avatar_url || null,
      failed_login_attempts: 0,
      lockout_until: null,
      terms_accepted_at: userData.terms_accepted_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_banned: false
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(userId, updates) {
    const index = this.users.findIndex((u) => u.id === userId || u.user_id === userId);
    if (index === -1) return null;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.users[index];
  }

  // OAuth Links
  getOAuthLinksForUser(userId) {
    return this.oauthLinks.filter((link) => link.user_id === userId);
  }

  findOAuthLink(provider, providerUserId) {
    return this.oauthLinks.find(
      (link) => link.provider === provider && link.provider_user_id === providerUserId
    );
  }

  addOAuthLink(userId, provider, providerUserId) {
    const identityOwner = this.findOAuthLink(provider, providerUserId);
    if (identityOwner && identityOwner.user_id !== userId) {
      throw new Error('Provider identity is already linked to another user');
    }

    const existing = this.oauthLinks.find(
      (l) => l.user_id === userId && l.provider === provider
    );
    if (existing) {
      if (existing.provider_user_id !== providerUserId) {
        throw new Error('User already has a different identity linked for this provider');
      }
      existing.last_login_at = new Date().toISOString();
      return existing;
    }
    const newLink = {
      id: `oauth-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      provider,
      provider_user_id: providerUserId,
      linked_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    };
    this.oauthLinks.push(newLink);
    return newLink;
  }

  removeOAuthLink(userId, provider) {
    const index = this.oauthLinks.findIndex(
      (l) => l.user_id === userId && l.provider === provider
    );
    if (index !== -1) {
      this.oauthLinks.splice(index, 1);
      return true;
    }
    return false;
  }

  // Session operations
  getActiveUserSessions(userId) {
    const now = new Date();
    return this.userSessions.filter(
      (s) =>
        s.user_id === userId &&
        !s.is_revoked &&
        new Date(s.expires_at) > now &&
        new Date(s.inactive_at) > now
    );
  }

  findSessionByTokenHash(tokenHash) {
    return this.userSessions.find((s) => s.refresh_token_hash === tokenHash);
  }

  findSessionByPreviousTokenHash(previousHash) {
    return this.userSessions.find((s) => s.previous_token_hash === previousHash);
  }

  findSessionById(sessionId) {
    return this.userSessions.find((s) => s.session_id === sessionId);
  }

  createSession(sessionData) {
    this.userSessions.push(sessionData);
    return sessionData;
  }

  updateSession(sessionId, updates) {
    const session = this.findSessionById(sessionId);
    if (!session) return null;
    Object.assign(session, updates);
    return session;
  }

  createPasswordResetToken(row) {
    this.passwordResetTokens.push(row);
    return row;
  }

  findPasswordResetToken(tokenHash) {
    return this.passwordResetTokens.find((t) => t.token_hash === tokenHash) || null;
  }

  consumePasswordResetToken(tokenHash) {
    const index = this.passwordResetTokens.findIndex((t) => t.token_hash === tokenHash);
    if (index === -1) return null;
    const [consumed] = this.passwordResetTokens.splice(index, 1);
    return consumed;
  }

  deletePasswordResetTokensForUser(userId) {
    this.passwordResetTokens = this.passwordResetTokens.filter((t) => t.user_id !== userId);
  }
}

export const db = new Database();
