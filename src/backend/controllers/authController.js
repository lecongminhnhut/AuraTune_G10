import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import {
  checkPasswordStrength,
  clearRefreshTokenCookie,
  createNewSession,
  formatUserResponse,
  generateAccessToken,
  generateRefreshToken,
  GRACE_PERIOD_SECONDS,
  hashToken,
  INACTIVITY_DAYS,
  LOCKOUT_MINUTES,
  MAX_FAILED_ATTEMPTS,
  REMEMBER_ME_DAYS,
  setRefreshTokenCookie
} from '../utils/authHelpers.js';

// POST /api/v1/auth/register (Spec 011)
export async function register(req, res) {
  try {
    const { email, password, display_name, terms_accepted } = req.body;

    if (!terms_accepted) {
      return res.status(400).json({
        success: false,
        message: 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để đăng ký.'
      });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ email không hợp lệ.'
      });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng.'
      });
    }

    const { isStrong } = checkPasswordStrength(password);
    if (!isStrong) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.'
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = db.createUser({
      email,
      display_name: display_name || email.split('@')[0],
      password_hash: passwordHash,
      role: 'user',
      terms_accepted_at: new Date().toISOString()
    });

    const { sessionObj, refreshToken } = createNewSession(newUser.id, req, false);
    const accessToken = generateAccessToken(newUser, sessionObj.session_id);
    setRefreshTokenCookie(res, refreshToken, INACTIVITY_DAYS);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: formatUserResponse(newUser),
        session: {
          access_token: accessToken,
          refresh_token: refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng ký.' });
  }
}

// POST /api/v1/auth/login (Spec 011)
export async function login(req, res) {
  try {
    const { email, password, remember_me } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu.'
      });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    if (user.lockout_until) {
      const lockoutTime = new Date(user.lockout_until).getTime();
      const nowTime = Date.now();
      if (lockoutTime > nowTime) {
        const remainingMin = Math.ceil((lockoutTime - nowTime) / (60 * 1000));
        return res.status(423).json({
          success: false,
          message: `Tài khoản tạm thời bị khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${remainingMin} phút.`,
          remainingMinutes: remainingMin
        });
      } else {
        db.updateUser(user.id, { failed_login_attempts: 0, lockout_until: null });
        user.failed_login_attempts = 0;
        user.lockout_until = null;
      }
    }

    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản này được tạo qua Social Login (Google/Facebook). Vui lòng chọn Đăng nhập bằng Social.'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      const failedCount = (user.failed_login_attempts || 0) + 1;
      let lockoutUntil = null;
      if (failedCount >= MAX_FAILED_ATTEMPTS) {
        lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString();
      }

      db.updateUser(user.id, {
        failed_login_attempts: lockoutUntil ? 0 : failedCount,
        lockout_until: lockoutUntil
      });

      if (lockoutUntil) {
        return res.status(423).json({
          success: false,
          message: `Tài khoản đã bị tạm khóa ${LOCKOUT_MINUTES} phút do thử sai mật khẩu 5 lần.`,
          remainingMinutes: LOCKOUT_MINUTES
        });
      }

      const remainingAttempts = MAX_FAILED_ATTEMPTS - failedCount;
      return res.status(401).json({
        success: false,
        message: `Mật khẩu không chính xác. Bạn còn ${remainingAttempts} lần thử trước khi tài khoản bị khóa.`,
        remainingAttempts
      });
    }

    db.updateUser(user.id, { failed_login_attempts: 0, lockout_until: null });

    const { sessionObj, refreshToken } = createNewSession(user.id, req, Boolean(remember_me));
    const accessToken = generateAccessToken(user, sessionObj.session_id);
    setRefreshTokenCookie(res, refreshToken, remember_me ? REMEMBER_ME_DAYS : INACTIVITY_DAYS);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: formatUserResponse(user),
        session: {
          access_token: accessToken,
          refresh_token: refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng nhập.' });
  }
}

// POST /api/v1/auth/oauth/login (Spec 012)
export async function oauthLogin(req, res) {
  try {
    const { provider, redirect_url } = req.body;
    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Nhà cung cấp OAuth không được hỗ trợ.' });
    }

    const callbackUrl = redirect_url || `${req.protocol}://${req.get('host')}/auth/callback`;
    return res.status(200).json({
      url: `${callbackUrl}?provider=${provider}&simulate=true`,
      provider
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'OAuth login initiation failed.' });
  }
}

// POST /api/v1/auth/oauth/callback (Spec 012)
export async function oauthCallback(req, res) {
  try {
    const { provider, email: payloadEmail, display_name: payloadName, avatar_url: payloadAvatar } = req.body;

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'invalid_provider', message: 'Nhà cung cấp OAuth không hợp lệ.' });
    }

    const isGoogle = provider === 'google';
    const oauthEmail = payloadEmail || (isGoogle ? 'alex.google@auratune.vn' : 'alex.fb@auratune.vn');
    const oauthDisplayName = payloadName || (isGoogle ? 'Alex (Google User)' : 'Alex (Facebook User)');
    const oauthAvatar = payloadAvatar || (isGoogle
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
    const providerUserId = `${provider}-uid-${Date.now()}`;

    let user = db.findUserByEmail(oauthEmail);

    if (user) {
      db.updateUser(user.id, {
        display_name: oauthDisplayName || user.display_name,
        avatar_url: oauthAvatar || user.avatar_url
      });
      user = db.findUserById(user.id);
      db.addOAuthLink(user.id, provider, providerUserId);
    } else {
      user = db.createUser({
        email: oauthEmail,
        display_name: oauthDisplayName,
        avatar_url: oauthAvatar,
        role: 'user',
        has_local_password: false
      });
      db.addOAuthLink(user.id, provider, providerUserId);
    }

    const { sessionObj, refreshToken } = createNewSession(user.id, req, true);
    const jwtAccessToken = generateAccessToken(user, sessionObj.session_id);
    setRefreshTokenCookie(res, refreshToken, REMEMBER_ME_DAYS);

    return res.status(200).json({
      token: jwtAccessToken,
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('OAuth Callback error:', error);
    return res.status(400).json({ error: 'oauth_failed', message: 'Đăng nhập OAuth thất bại.' });
  }
}

// POST /api/v1/auth/oauth/unlink (Spec 012)
export async function oauthUnlink(req, res) {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { provider } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'unauthorized', message: 'Yêu cầu xác thực.' });
    }

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'not_found', message: 'Không tìm thấy người dùng.' });
    }

    const linkedProviders = db.getOAuthLinksForUser(user.id).map((l) => l.provider);
    const hasLocalPassword = Boolean(user.has_local_password || user.password_hash);
    const remainingOAuth = linkedProviders.filter((p) => p !== provider);

    const totalMethodsRemaining = (hasLocalPassword ? 1 : 0) + remainingOAuth.length;
    if (totalMethodsRemaining <= 0) {
      return res.status(400).json({
        error: 'cannot_unlink',
        message: 'Bạn không thể hủy liên kết nhà cung cấp này vì đây là phương thức đăng nhập duy nhất của tài khoản. Vui lòng thiết lập mật khẩu hoặc liên kết một tài khoản khác trước.'
      });
    }

    db.removeOAuthLink(user.id, provider);
    return res.status(200).json({
      success: true,
      message: `Đã hủy liên kết nhà cung cấp ${provider} thành công.`
    });
  } catch (error) {
    return res.status(500).json({ error: 'server_error', message: 'Lỗi xử lý hủy liên kết provider.' });
  }
}

// POST /api/v1/auth/refresh (Spec 013)
export async function refreshSession(req, res) {
  try {
    const refreshToken = req.cookies?.auratune_refresh_token || req.body?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Thiếu Refresh Token.'
      });
    }

    const currentHash = hashToken(refreshToken);
    const now = new Date();

    let session = db.findSessionByTokenHash(currentHash);
    let isGraceUse = false;

    if (!session) {
      const graceSession = db.findSessionByPreviousTokenHash(currentHash);
      if (graceSession) {
        const graceExpires = graceSession.grace_expires_at ? new Date(graceSession.grace_expires_at) : null;
        if (graceExpires && graceExpires > now) {
          session = graceSession;
          isGraceUse = true;
        } else {
          graceSession.is_revoked = true;
          clearRefreshTokenCookie(res);
          return res.status(401).json({
            status: 'error',
            message: 'Phát hiện mã phiên bị chiếm đoạt/sử dụng lại trái phép. Phiên đã bị thu hồi vì lý do bảo mật.'
          });
        }
      }
    }

    if (!session || session.is_revoked) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        status: 'error',
        message: 'Phiên đăng nhập không hợp lệ hoặc đã bị thu hồi. Vui lòng đăng nhập lại.'
      });
    }

    if (new Date(session.expires_at) <= now || new Date(session.inactive_at) <= now) {
      session.is_revoked = true;
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        status: 'error',
        message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }

    const user = db.findUserById(session.user_id);
    if (!user || user.is_banned) {
      session.is_revoked = true;
      clearRefreshTokenCookie(res);
      return res.status(401).json({ status: 'error', message: 'Tài khoản không tồn tại hoặc đã bị khóa.' });
    }

    let newRefreshToken = refreshToken;
    if (!isGraceUse) {
      newRefreshToken = generateRefreshToken();
      const newHash = hashToken(newRefreshToken);

      session.previous_token_hash = session.refresh_token_hash;
      session.grace_expires_at = new Date(now.getTime() + GRACE_PERIOD_SECONDS * 1000).toISOString();
      session.refresh_token_hash = newHash;

      session.last_active_at = now.toISOString();
      session.inactive_at = new Date(now.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString();
    }

    const newAccessToken = generateAccessToken(user, session.session_id);
    const durationDays = session.remember_me ? REMEMBER_ME_DAYS : INACTIVITY_DAYS;
    setRefreshTokenCookie(res, newRefreshToken, durationDays);

    return res.status(200).json({
      status: 'success',
      data: {
        access_token: newAccessToken,
        expires_in: 900,
        user: formatUserResponse(user)
      }
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ status: 'error', message: 'Lỗi làm mới token.' });
  }
}

// POST /api/v1/auth/logout (Spec 013)
export async function logout(req, res) {
  try {
    const refreshToken = req.cookies?.auratune_refresh_token || req.body?.refresh_token;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      const session = db.findSessionByTokenHash(tokenHash) || db.findSessionByPreviousTokenHash(tokenHash);
      if (session) {
        session.is_revoked = true;
      }
    }
    clearRefreshTokenCookie(res);

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Lỗi khi đăng xuất.' });
  }
}

// POST /api/v1/auth/logout-all (Spec 013)
export async function logoutAll(req, res) {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const activeSessions = db.getActiveUserSessions(userId);
    let count = 0;
    activeSessions.forEach((s) => {
      s.is_revoked = true;
      count++;
    });

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      status: 'success',
      message: 'All active sessions terminated successfully',
      revoked_count: count
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Lỗi đăng xuất tất cả thiết bị.' });
  }
}


// GET /api/v1/auth/sessions (Spec 013)
export async function getSessions(req, res) {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const currentSessionId = req.user?.session_id;

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const sessions = db.getActiveUserSessions(userId).map((s) => ({
      session_id: s.session_id,
      device_info: s.device_info,
      ip_address: s.ip_address,
      created_at: s.created_at,
      last_active_at: s.last_active_at,
      is_current: s.session_id === currentSessionId
    }));

    return res.status(200).json({
      status: 'success',
      data: sessions
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Lỗi truy xuất danh sách phiên.' });
  }
}

// GET /api/v1/auth/me (Spec 011 & 013)
export async function getMe(req, res) {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
}

// POST /api/v1/auth/forgot-password (Spec 011)
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống.' });
  }
  return res.status(200).json({
    success: true,
    message: 'Mã khôi phục mật khẩu đã được gửi đến email của bạn.'
  });
}

// POST /api/v1/auth/reset-password (Spec 011)
export async function resetPassword(req, res) {
  const { email, new_password } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Email không tồn tại.' });
  }

  const { isStrong } = checkPasswordStrength(new_password);
  if (!isStrong) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu mới không đủ độ mạnh.'
    });
  }

  const passwordHash = bcrypt.hashSync(new_password, 10);
  db.updateUser(user.id, { password_hash: passwordHash, has_local_password: true });

  return res.status(200).json({
    success: true,
    message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.'
  });
}


