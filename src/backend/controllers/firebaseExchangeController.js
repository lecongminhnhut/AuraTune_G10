
import crypto from 'node:crypto';
import { adminAuth } from '../config/firebaseAdmin.js';
import { db } from '../db.js';
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
      console.error('Firebase token rejected:', error.code);

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

    // 3. Find existing AuraTune user by Firebase UID
    let user = db.findUserByFirebaseUid(firebaseUid);
    let isNewUser = false;

    if (!user) {
      const existingLink = db.findOAuthLink(
        'firebase',
        firebaseUid
      );

      // A link exists, but its AuraTune user is missing
      if (existingLink) {
        return res.status(409).json({
          success: false,
          message: 'Firebase account link is inconsistent'
        });
      }

      const email = decoded.email?.trim().toLowerCase();

      // New accounts require a verified email address
      if (!email || decoded.email_verified !== true) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your Firebase email first'
        });
      }

      // Never auto-link an existing account by email
      if (db.findUserByEmail(email)) {
        return res.status(409).json({
          success: false,
          code: 'ACCOUNT_LINK_REQUIRED',
          message: 'An AuraTune account already uses this email'
        });
      }

      // Firebase sign-in alone does not imply consent
      if (req.body?.terms_accepted !== true) {
        return res.status(400).json({
          success: false,
          code: 'TERMS_ACCEPTANCE_REQUIRED',
          message: 'Accept the terms before registration'
        });
      }

      const displayName =
        typeof decoded.name === 'string' &&
        decoded.name.trim()
          ? decoded.name.trim().slice(0, 100)
          : email.split('@')[0];

      // 4. Create AuraTune user with minimum privilege
      user = db.createUser({
        id: `u-${crypto.randomUUID()}`,
        email,
        display_name: displayName,
        role: 'user',
        password_hash: null,
        terms_accepted_at: new Date().toISOString()
      });

      db.linkFirebaseUid(user.id, firebaseUid);
      isNewUser = true;
    }

    // 5. Enforce AuraTune account restrictions
    if (user.is_banned) {
      return res.status(403).json({
        success: false,
        message: 'AuraTune account is disabled'
      });
    }

    if (
      user.lockout_until &&
      new Date(user.lockout_until).getTime() > Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message: 'AuraTune account is temporarily locked'
      });
    }

    // 6. Reuse existing AuraTune session system
    const { sessionObj, refreshToken } = createNewSession(
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
        user: formatUserResponse(user),
        session: {
          access_token: accessToken,
          expires_in: 900
        }
      }
    });
  } catch (error) {
    console.error('Firebase Exchange error:', error);

    return res.status(500).json({
      success: false,
      message: 'Firebase Token Exchange failed'
    });
  }
}
