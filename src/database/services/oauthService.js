/**
 * OAuth Service - Business logic & integration routines for Google & Facebook OAuth authentication.
 * Extended for Spec 012 (OAuth Authentication).
 */

import { supabase } from '../supabaseClient.js';

/**
 * Supported OAuth Providers
 */
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
};

/**
 * Initiates OAuth login/signup flow with the configured Supabase provider.
 */
export async function initiateOAuthLogin(provider, redirectTo = `${window.location.origin}/auth/callback`) {
  if (![OAUTH_PROVIDERS.GOOGLE, OAUTH_PROVIDERS.FACEBOOK].includes(provider)) {
    throw new Error(`Nhà cung cấp '${provider}' không được hỗ trợ. Chỉ hỗ trợ Google và Facebook.`);
  }

  // Attempt real Supabase OAuth redirect if env is configured
  if (supabase && typeof supabase.auth?.signInWithOAuth === 'function') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (!error && data?.url) {
        return { success: true, url: data.url, mode: 'redirect' };
      }
    } catch (err) {
      console.warn('Supabase OAuth real redirect failed or not configured, using local OAuth simulation flow:', err);
    }
  }

  throw new Error(`${provider} OAuth is not configured. Configure the identity provider before using this flow.`);
}

/**
 * Handle Account Linking and Profile Sync logic when receiving OAuth payload.
 * Rule 1 (Account Linking): Unique email check. If email exists, link to existing account without duplicating user record.
 * Rule 2 (Profile Sync): Sync displayName and avatarUrl from provider on every successful login.
 */
export function processOAuthUser(existingUsers, oauthPayload) {
  const { provider, providerUserId, email, displayName, avatarUrl } = oauthPayload;

  if (!email || !email.includes('@')) {
    throw new Error('Đăng nhập OAuth thất bại: Email không hợp lệ hoặc bị từ chối cấp quyền từ Provider.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUserIndex = existingUsers.findIndex(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );

  let updatedUsers = [...existingUsers];
  let targetUser = null;
  let isNewAccount = false;

  if (existingUserIndex >= 0) {
    // Existing user found -> Account Linking & Profile Sync on login
    const userToUpdate = updatedUsers[existingUserIndex];
    const linkedProviders = Array.from(new Set([...(userToUpdate.linkedProviders || []), provider]));

    targetUser = {
      ...userToUpdate,
      displayName: displayName || userToUpdate.displayName,
      avatarUrl: avatarUrl || userToUpdate.avatarUrl,
      linkedProviders,
      lastLoginAt: new Date().toISOString(),
    };
    updatedUsers[existingUserIndex] = targetUser;
  } else {
    // New user -> Auto register with role 'user'
    isNewAccount = true;
    targetUser = {
      id: `u-oauth-${Date.now()}`,
      email: normalizedEmail,
      displayName: displayName || email.split('@')[0],
      avatarUrl: avatarUrl || null,
      role: 'user',
      hasLocalPassword: false,
      linkedProviders: [provider],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      banned: false,
    };
    updatedUsers.push(targetUser);
  }

  return {
    users: updatedUsers,
    currentUser: targetUser,
    isNewAccount,
  };
}

/**
 * Rule (Conditional Provider Unlinking):
 * Disconnect a provider ONLY if another auth method exists (Local password or another OAuth provider).
 */
export function checkCanUnlinkProvider(user, providerToUnlink) {
  if (!user) return { canUnlink: false, reason: 'Không tìm thấy thông tin người dùng.' };

  const linkedProviders = user.linkedProviders || [];
  const hasLocalPassword = !!user.hasLocalPassword || !!user.passwordHash;

  const remainingOAuthProviders = linkedProviders.filter((p) => p !== providerToUnlink);
  const totalRemainingMethods = (hasLocalPassword ? 1 : 0) + remainingOAuthProviders.length;

  if (totalRemainingMethods <= 0) {
    return {
      canUnlink: false,
      reason: 'Bạn không thể hủy liên kết nhà cung cấp này vì đây là phương thức đăng nhập duy nhất của tài khoản. Vui lòng thiết lập mật khẩu hoặc liên kết một tài khoản khác trước.',
    };
  }

  return { canUnlink: true, remainingProviders: remainingOAuthProviders };
}
