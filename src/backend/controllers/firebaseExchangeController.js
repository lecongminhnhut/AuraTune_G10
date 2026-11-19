
import crypto from 'node:crypto';
import { adminAuth } from '../config/firebaseAdmin.js';
import { db } from '../repositories/authRepository.js';
import {
  createNewSession,
  generateAccessToken,
  setRefreshTokenCookie,
  formatUserResponse,
  INACTIVITY_DAYS
} from '../utils/authHelpers.js';

export async function firebaseExchange(req, res) {
  try {
    // 1. Read Firebase ID Token from Authorization header
    const authorization = req.headers.authorization || '';
    const match = /^Bearer\s+(\S+)$/i.exec(authorization);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Missing Firebase ID Token'
      });
    }

    // 2. Verify Firebase ID Token and check revocation
    let decoded;

    try {
      decoded = await adminAuth.verifyIdToken(match[1], true);
    } catch (error) {
      console.error('Firebase token verification failed:', { code: error.code, message: error.message });

      if (error.code?.startsWith('app/')) {
        return res.status(503).json({
          success: false,
          code: 'FIREBASE_ADMIN_CONFIGURATION_ERROR',
          message: 'The server could not initialize Firebase Admin credentials.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid or revoked Firebase ID Token'
      });
    }

    const firebaseUid = decoded.uid;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: 'Firebase UID is missing'
      });
    }

    const signInProvider = decoded.firebase?.sign_in_provider;
    if (!['password', 'google.com', 'facebook.com'].includes(signInProvider)) {
      return res.status(403).json({
        success: false,
        code: 'UNSUPPORTED_IDENTITY_PROVIDER',
        message: 'Only email, Google, and Facebook sign-in are supported.'
      });
    }

    const email = decoded.email?.trim().toLowerCase();
    if (signInProvider !== 'facebook.com' && (!email || decoded.email_verified !== true)) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_VERIFICATION_REQUIRED',
        message: 'Your provider account must include a verified email address.'
      });
    }

    const provider = signInProvider === 'google.com'
      ? 'google'
      : signInProvider === 'facebook.com'
        ? 'facebook'
        : 'firebase';
    const requestedDisplayName = typeof req.body?.display_name === 'string'
      ? req.body.display_name.trim().slice(0, 50)
      : '';

    // Facebook sign-in is accepted only for an explicitly linked Facebook identity.
    const facebookLink = provider === 'facebook' ? await db.findOAuthLink('facebook', firebaseUid) : null;
    let user = provider === 'facebook'
      ? (facebookLink ? await db.findUserById(facebookLink.user_id) : null)
      : await db.findUserByFirebaseUid(firebaseUid);
    let isNewUser = false;

    if (!user) {
      if (provider === 'facebook') {
        return res.status(403).json({
          success: false,
          code: 'FACEBOOK_ACCOUNT_NOT_LINKED',
          message: 'Link this Facebook identity from your signed-in AuraTune account before using it to sign in.'
        });
      }

      if (!decoded.email || decoded.email_verified !== true) {
        return res.status(403).json({
          success: false,
          code: 'EMAIL_VERIFICATION_REQUIRED',
          message: 'Your provider account must include a verified email address.'
        });
      }

      const existingUserByEmail = await db.findUserByEmail(email);

      // If an AuraTune account with this verified email already exists, link Google UID to it
      if (existingUserByEmail) {
        await db.addOAuthLink(existingUserByEmail.id, provider, firebaseUid);
        user = existingUserByEmail;
      } else {
        // Firebase sign-in alone does not imply consent for new accounts
        if (req.body?.terms_accepted !== true) {
          if (provider === 'google') {
            return res.status(404).json({
              success: false,
              code: 'GOOGLE_ACCOUNT_NOT_REGISTERED',
              message: 'Tài khoản Google này chưa có tài khoản AuraTune. Hãy đăng ký trước.'
            });
          }
          return res.status(400).json({
            success: false,
            code: 'TERMS_ACCEPTANCE_REQUIRED',
            message: 'Accept the terms before registration'
          });
        }

        const displayName = (requestedDisplayName
          || (typeof decoded.name === 'string' ? decoded.name.trim() : '')
          || email.split('@')[0]).slice(0, 50);

        // 4. Create AuraTune user with minimum privilege
        user = await db.createUser({
          id: `u-${crypto.randomUUID()}`,
          email,
          display_name: displayName,
          role: 'user',
          password_hash: null,
          terms_accepted_at: new Date().toISOString()
        });

        await db.addOAuthLink(user.id, provider, firebaseUid);
        isNewUser = true;
      }
    }

    // 5. Enforce AuraTune account restrictions
    if (user.is_banned) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_DISABLED',
        message: 'AuraTune account is disabled'
      });
    }

    if (
      user.lockout_until &&
      new Date(user.lockout_until).getTime() > Date.now()
    ) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_TEMPORARILY_LOCKED',
        message: 'AuraTune account is temporarily locked'
      });
    }

    const profileUpdates = {};
    // An explicit registration submission can update a profile created during
    // an earlier incomplete attempt. Normal Google sign-ins must preserve the
    // user's AuraTune display name and only fill it for legacy profiles missing one.
    if (req.body?.terms_accepted === true && requestedDisplayName) {
      profileUpdates.display_name = requestedDisplayName;
    } else if (!user.display_name && typeof decoded.name === 'string' && decoded.name.trim()) {
      profileUpdates.display_name = decoded.name.trim().slice(0, 50);
    }
    if (typeof decoded.picture === 'string' && decoded.picture.trim()) {
      profileUpdates.avatar_url = decoded.picture.trim();
    }
    if (Object.keys(profileUpdates).length) {
      user = await db.updateUser(user.id, profileUpdates);
    }

    // 6. Reuse existing AuraTune session system
    const { sessionObj, refreshToken } = await createNewSession(
      user.id,
      req,
      false
    );

    const accessToken = generateAccessToken(
      user,
      sessionObj.session_id
    );

    setRefreshTokenCookie(
      res,
      refreshToken,
      INACTIVITY_DAYS
    );

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser
        ? 'Firebase account registered successfully'
        : 'Firebase login successful',
      data: {
        user: await formatUserResponse(user),
        session: {
          access_token: accessToken,
          expires_in: 900
        }
      }
    });
  } catch (error) {
    console.error('Firebase Exchange error:', { code: error.code, message: error.message });

    if (/already linked to another user|different identity linked for this provider/i.test(error.message || '')) {
      return res.status(409).json({
        success: false,
        code: 'GOOGLE_IDENTITY_LINK_CONFLICT',
        message: 'This Google identity or email is already linked to a different AuraTune sign-in. Use the Google account originally linked to this AuraTune account.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Firebase Token Exchange failed'
    });
  }
}

export async function linkFacebook(req, res) {
  const userId = req.user?.user_id || req.user?.id;
  if (!userId || !await db.findUserById(userId)) {
    return res.status(401).json({ success: false, code: 'UNAUTHENTICATED', message: 'Hãy đăng nhập AuraTune trước khi liên kết Facebook.' });
  }

  const firebaseIdToken = req.headers['x-firebase-id-token'];
  if (typeof firebaseIdToken !== 'string' || !firebaseIdToken.trim()) {
    return res.status(401).json({ success: false, code: 'FACEBOOK_TOKEN_REQUIRED', message: 'Thiếu thông tin xác thực Facebook. Hãy thử lại.' });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(firebaseIdToken.trim(), true);
    const hasFacebookIdentity = decoded.firebase?.sign_in_provider === 'facebook.com'
      || Boolean(decoded.firebase?.identities?.['facebook.com']?.length);
    if (!hasFacebookIdentity || !decoded.uid) {
      return res.status(403).json({ success: false, code: 'FACEBOOK_IDENTITY_REQUIRED', message: 'Hãy xác thực bằng Facebook trước khi liên kết.' });
    }

    const identityOwner = await db.findOAuthLink('facebook', decoded.uid);
    if (identityOwner && identityOwner.user_id !== userId) {
      return res.status(409).json({ success: false, code: 'FACEBOOK_ALREADY_LINKED', message: 'Tài khoản Facebook này đã được liên kết với tài khoản AuraTune khác.' });
    }

    const firebaseAccountOwner = await db.findUserByFirebaseUid(decoded.uid);
    if (firebaseAccountOwner && firebaseAccountOwner.id !== userId) {
      return res.status(409).json({ success: false, code: 'FACEBOOK_IDENTITY_LINK_CONFLICT', message: 'Danh tính Firebase này thuộc tài khoản AuraTune khác. Hãy đăng nhập đúng tài khoản rồi thử lại.' });
    }

    await db.addOAuthLink(userId, 'facebook', decoded.uid);
    return res.status(200).json({ success: true, provider: 'facebook', message: 'Liên kết Facebook thành công.' });
  } catch (error) {
    if (error.message?.includes('different identity')) {
      return res.status(409).json({ success: false, code: 'FACEBOOK_ALREADY_LINKED', message: 'Tài khoản AuraTune này đã liên kết với một tài khoản Facebook khác.' });
    }
    if (error.code?.startsWith('auth/')) {
      return res.status(401).json({ success: false, code: 'FACEBOOK_TOKEN_INVALID', message: 'Phiên xác thực Facebook không hợp lệ hoặc đã hết hạn. Hãy thử lại.' });
    }
    console.error('Facebook link error:', error.code || error.message);
    return res.status(500).json({ success: false, code: 'FACEBOOK_LINK_FAILED', message: 'Không thể liên kết Facebook lúc này. Hãy thử lại sau.' });
  }
}
