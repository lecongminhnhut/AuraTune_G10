import { randomUUID } from 'node:crypto';
import { supabase } from '../../database/supabaseClient.js';

function client() {
  if (!supabase) throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  return supabase;
}

function unwrap(result) {
  if (result.error) throw result.error;
  return result.data;
}

export const db = {
  async findUserByEmail(email) {
    if (!email) return null;
    return unwrap(await client().from('users').select('*').eq('email', email.trim().toLowerCase()).maybeSingle());
  },
  async findUserById(userId) {
    if (!userId) return null;
    return await unwrap(await client().from('users').select('*').eq('id', userId).maybeSingle())
      || unwrap(await client().from('users').select('*').eq('user_id', userId).maybeSingle());
  },
  async findUserByFirebaseUid(uid) {
    const link = await this.findOAuthLink('firebase', uid)
      || await this.findOAuthLink('google', uid)
      || await this.findOAuthLink('facebook', uid);
    return link ? this.findUserById(link.user_id) : null;
  },
  async createUser(userData) {
    const id = userData.id || `u-${randomUUID()}`;
    const row = {
      id,
      user_id: id,
      email: userData.email.trim().toLowerCase(),
      // Keep compatibility with legacy users tables that still require `name`.
      name: userData.display_name,
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
      is_banned: false,
    };
    return unwrap(await client().from('users').insert(row).select().single());
  },
  async updateUser(userId, updates) {
    return unwrap(await client().from('users').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId).select().maybeSingle());
  },
  async createPasswordResetToken(row) {
    return unwrap(await client().from('password_reset_tokens').insert(row).select().single());
  },
  async findPasswordResetToken(tokenHash) {
    return unwrap(await client().from('password_reset_tokens').select('*').eq('token_hash', tokenHash).maybeSingle());
  },
  async consumePasswordResetToken(tokenHash) {
    const result = await client().from('password_reset_tokens').delete().eq('token_hash', tokenHash).select('token_hash').maybeSingle();
    return unwrap(result);
  },
  async deletePasswordResetTokensForUser(userId) {
    const result = await client().from('password_reset_tokens').delete().eq('user_id', userId);
    if (result.error) throw result.error;
  },
  async getOAuthLinksForUser(userId) {
    return unwrap(await client().from('oauth_links').select('*').eq('user_id', userId));
  },
  async findOAuthLink(provider, providerUserId) {
    if (!providerUserId) return null;
    return unwrap(await client().from('oauth_links').select('*').eq('provider', provider).eq('provider_user_id', providerUserId).maybeSingle());
  },
  async addOAuthLink(userId, provider, providerUserId) {
    const existing = await this.findOAuthLink(provider, providerUserId);
    if (existing && existing.user_id !== userId) throw new Error('Provider identity is already linked to another user');
    const userLinks = await this.getOAuthLinksForUser(userId);
    const currentProvider = userLinks.find((link) => link.provider === provider);
    if (currentProvider) {
      if (currentProvider.provider_user_id !== providerUserId) throw new Error('User already has a different identity linked for this provider');
      const updated = unwrap(await client().from('oauth_links').update({ last_login_at: new Date().toISOString() }).eq('id', currentProvider.id).select().single());
      return updated;
    }
    return unwrap(await client().from('oauth_links').insert({ user_id: userId, provider, provider_user_id: providerUserId, linked_at: new Date().toISOString(), last_login_at: new Date().toISOString() }).select().single());
  },
  async removeOAuthLink(userId, provider) {
    const result = await client().from('oauth_links').delete().eq('user_id', userId).eq('provider', provider);
    if (result.error) throw result.error;
    return true;
  },
  async createSession(session) {
    return unwrap(await client().from('user_sessions').insert(session).select().single());
  },
  async findSessionById(id) {
    return unwrap(await client().from('user_sessions').select('*').eq('session_id', id).maybeSingle());
  },
  async findSessionByTokenHash(hash) {
    if (!hash) return null;
    return unwrap(await client().from('user_sessions').select('*').eq('refresh_token_hash', hash).maybeSingle());
  },
  async findSessionByPreviousTokenHash(hash) {
    if (!hash) return null;
    return unwrap(await client().from('user_sessions').select('*').eq('previous_token_hash', hash).maybeSingle());
  },
  async updateSession(sessionId, updates) {
    return unwrap(await client().from('user_sessions').update(updates).eq('session_id', sessionId).select().maybeSingle());
  },
  async getActiveUserSessions(userId) {
    const now = new Date().toISOString();
    return unwrap(await client().from('user_sessions').select('*').eq('user_id', userId).eq('is_revoked', false).gt('expires_at', now).gt('inactive_at', now));
  },
};
