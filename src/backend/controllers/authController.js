import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { db } from '../repositories/authRepository.js';
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

    const existingUser = await db.findUserByEmail(email);
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
    const newUser = await db.createUser({
      email,
      display_name: display_name || email.split('@')[0],
      password_hash: passwordHash,
      role: 'user',
      terms_accepted_at: new Date().toISOString()
    });

    const { sessionObj, refreshToken } = await createNewSession(newUser.id, req, false);
    const accessToken = generateAccessToken(newUser, sessionObj.session_id);
    setRefreshTokenCookie(res, refreshToken, INACTIVITY_DAYS);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: await formatUserResponse(newUser),
        session: {
          access_token: accessToken,
          expires_in: 900
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

    const user = await db.findUserByEmail(email);
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
        await db.updateUser(user.id, { failed_login_attempts: 0, lockout_until: null });
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

      await db.updateUser(user.id, {
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

    await db.updateUser(user.id, { failed_login_attempts: 0, lockout_until: null });

    const { sessionObj, refreshToken } = await createNewSession(user.id, req, Boolean(remember_me));
    const accessToken = generateAccessToken(user, sessionObj.session_id);
    setRefreshTokenCookie(res, refreshToken, remember_me ? REMEMBER_ME_DAYS : INACTIVITY_DAYS);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: await formatUserResponse(user),
        session: {
          access_token: accessToken,
          expires_in: 900
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
    const { provider } = req.body;
    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Nhà cung cấp OAuth không được hỗ trợ.' });
    }

    return res.status(503).json({
      success: false,
      code: 'OAUTH_PROVIDER_FLOW_UNAVAILABLE',
      message: 'Use the configured Firebase Google or Facebook sign-in flow.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'OAuth login initiation failed.' });
  }
}

// POST /api/v1/auth/oauth/callback (Spec 012)
export async function oauthCallback(req, res) {
  return res.status(410).json({
    success: false,
    code: 'SIGNED_PROVIDER_TOKEN_REQUIRED',
    message: 'Sign in with Google or Facebook and exchange the signed Firebase identity token.'
  });
}

// POST /api/v1/auth/oauth/unlink (Spec 012)
export async function oauthUnlink(req, res) {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { provider } = req.body;

    if (!['google', 'facebook', 'firebase'].includes(provider)) {
      return res.status(400).json({ error: 'invalid_provider', message: 'Unsupported identity provider.' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'unauthorized', message: 'Yêu cầu xác thực.' });
    }

    const user = await db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'not_found', message: 'Không tìm thấy người dùng.' });
    }

    const linkedProviders = (await db.getOAuthLinksForUser(user.id)).map((l) => l.provider);
    if (!linkedProviders.includes(provider)) {
      return res.status(404).json({ error: 'provider_not_linked', message: 'This provider is not linked to the account.' });
    }
    const hasLocalPassword = Boolean(user.has_local_password || user.password_hash);
    const remainingOAuth = linkedProviders.filter((p) => p !== provider);

    const totalMethodsRemaining = (hasLocalPassword ? 1 : 0) + remainingOAuth.length;
    if (totalMethodsRemaining <= 0) {
      return res.status(400).json({
        error: 'cannot_unlink',
        message: 'Bạn không thể hủy liên kết nhà cung cấp này vì đây là phương thức đăng nhập duy nhất của tài khoản. Vui lòng thiết lập mật khẩu hoặc liên kết một tài khoản khác trước.'
      });
    }

    await db.removeOAuthLink(user.id, provider);
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
    const refreshToken = req.cookies?.auratune_refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Thiếu Refresh Token.'
      });
    }

    const currentHash = hashToken(refreshToken);
    const now = new Date();

    let session = await db.findSessionByTokenHash(currentHash);
    let isGraceUse = false;

    if (!session) {
      const graceSession = await db.findSessionByPreviousTokenHash(currentHash);
      if (graceSession) {
        const graceExpires = graceSession.grace_expires_at ? new Date(graceSession.grace_expires_at) : null;
        if (graceExpires && graceExpires > now) {
          session = graceSession;
          isGraceUse = true;
        } else {
          await db.updateSession(graceSession.session_id, { is_revoked: true });
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

    if (session.device_info && req.headers['user-agent'] !== session.device_info) {
      await db.updateSession(session.session_id, { is_revoked: true });
      clearRefreshTokenCookie(res);
      return res.status(401).json({ status: 'error', message: 'Thiết bị đăng nhập đã thay đổi. Vui lòng đăng nhập lại.' });
    }

    if (new Date(session.expires_at) <= now || new Date(session.inactive_at) <= now) {
      await db.updateSession(session.session_id, { is_revoked: true });
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        status: 'error',
        message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }

    const user = await db.findUserById(session.user_id);
    if (!user || user.is_banned) {
      await db.updateSession(session.session_id, { is_revoked: true });
      clearRefreshTokenCookie(res);
      return res.status(401).json({ status: 'error', message: 'Tài khoản không tồn tại hoặc đã bị khóa.' });
    }

    let newRefreshToken = refreshToken;
    if (!isGraceUse) {
      newRefreshToken = generateRefreshToken();
      const newHash = hashToken(newRefreshToken);

      const updatedSession = await db.updateSession(session.session_id, {
        previous_token_hash: session.refresh_token_hash,
        grace_expires_at: new Date(now.getTime() + GRACE_PERIOD_SECONDS * 1000).toISOString(),
        refresh_token_hash: newHash,
        last_active_at: now.toISOString(),
        inactive_at: new Date(now.getTime() + INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        ip_address: req.ip || req.socket?.remoteAddress || session.ip_address
      });
      if (updatedSession) Object.assign(session, updatedSession);
    }

    const newAccessToken = generateAccessToken(user, session.session_id);
    const durationDays = session.remember_me ? REMEMBER_ME_DAYS : INACTIVITY_DAYS;
    if (!isGraceUse) setRefreshTokenCookie(res, newRefreshToken, durationDays);
    return res.status(200).json({
      status: 'success',
      data: {
        access_token: newAccessToken,
        expires_in: 900,
        user: await formatUserResponse(user)
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
    const refreshToken = req.cookies?.auratune_refresh_token;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      const session = await db.findSessionByTokenHash(tokenHash) || await db.findSessionByPreviousTokenHash(tokenHash);
      if (session) {
        await db.updateSession(session.session_id, { is_revoked: true });
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

    const activeSessions = await db.getActiveUserSessions(userId);
    let count = 0;
    for (const s of activeSessions) {
      await db.updateSession(s.session_id, { is_revoked: true });
      count++;
    }

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

    const sessions = (await db.getActiveUserSessions(userId)).map((s) => ({
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
    const user = await db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: await formatUserResponse(user)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user' });
  }
}

// POST /api/v1/auth/forgot-password (Spec 011)
export async function forgotPassword(req, res) {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
  }
  // Keep the response identical for known and unknown addresses to prevent account discovery.
  const accepted = { success: true, message: 'Nếu tài khoản có mật khẩu AuraTune và email hợp lệ, hướng dẫn đặt lại sẽ được gửi đến hộp thư.' };
  let pendingTokenHash = null;
  try {
    const user = await db.findUserByEmail(email);
    if (!user?.password_hash || !process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return res.status(200).json(accepted);
    const token = crypto.randomBytes(32).toString('base64url');
    const tokenHash = hashToken(token);
    await db.deletePasswordResetTokensForUser(user.id);
    await db.createPasswordResetToken({ user_id: user.id, token_hash: tokenHash, expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() });
    pendingTokenHash = tokenHash;
    const appUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [email], subject: 'Đặt lại mật khẩu AuraTune', html: `<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu AuraTune.</p><p><a href="${resetUrl}">Đặt lại mật khẩu</a></p><p>Liên kết hết hạn sau 30 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>` })
    });
    if (!delivery.ok) {
      await db.consumePasswordResetToken(tokenHash);
      pendingTokenHash = null;
      console.error('Password reset email delivery failed:', delivery.status);
    } else {
      pendingTokenHash = null;
    }
  } catch (error) {
    if (pendingTokenHash) {
      try {
        await db.consumePasswordResetToken(pendingTokenHash);
      } catch (cleanupError) {
        console.error('Failed to clean up undelivered password reset token:', cleanupError.message);
      }
    }
    console.error('Password recovery request failed:', error.message);
  }
  return res.status(200).json(accepted);
}

// POST /api/v1/auth/reset-password (Spec 011)
export async function resetPassword(req, res) {
  try {
    const { token, new_password } = req.body || {};
    if (typeof token !== 'string' || !token || typeof new_password !== 'string') return res.status(400).json({ success: false, message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' });
    const { isStrong } = checkPasswordStrength(new_password);
    if (!isStrong) return res.status(400).json({ success: false, message: 'Mật khẩu cần tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' });
    const tokenHash = hashToken(token);
    const reset = await db.findPasswordResetToken(tokenHash);
    if (!reset || new Date(reset.expires_at).getTime() <= Date.now()) {
      if (reset) await db.consumePasswordResetToken(tokenHash);
      return res.status(400).json({ success: false, message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' });
    }
    const consumed = await db.consumePasswordResetToken(tokenHash);
    if (!consumed) return res.status(400).json({ success: false, message: 'Liên kết đặt lại mật khẩu đã được sử dụng.' });
    await db.updateUser(reset.user_id, { password_hash: bcrypt.hashSync(new_password, 10), has_local_password: true });
    for (const session of await db.getActiveUserSessions(reset.user_id)) await db.updateSession(session.session_id, { is_revoked: true });
    await db.deletePasswordResetTokensForUser(reset.user_id);
    return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error) {
    console.error('Password reset failed:', error.message);
    return res.status(500).json({ success: false, message: 'Không thể đặt lại mật khẩu lúc này.' });
  }
}
