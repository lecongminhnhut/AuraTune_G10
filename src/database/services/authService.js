/**
 * Auth Service - Triển khai các hàm xác thực theo đặc tả Spec 011 & Data Model
 */

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Kiểm tra định dạng Email
 */
export const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test((email || '').trim());
};

/**
 * Kiểm tra độ mạnh của mật khẩu theo chuẩn Spec 011:
 * - Ít nhất 8 ký tự
 * - Có chữ cái hoa [A-Z]
 * - Có chữ cái thường [a-z]
 * - Có chữ số [0-9]
 * - Có ký tự đặc biệt [!@#$%^&*(),.?":{}|<>]
 */
export const validatePassword = (password) => {
  const val = password || '';
  const checks = {
    minLength: val.length >= 8,
    hasUpper: /[A-Z]/.test(val),
    hasLower: /[a-z]/.test(val),
    hasDigit: /\d/.test(val),
    hasSpecial: /[^A-Za-z0-9]/.test(val),
  };
  const isStrong = Object.values(checks).every(Boolean);
  return { isStrong, checks };
};

/**
 * Kiểm tra trạng thái khóa tài khoản
 */
export const checkAccountLockout = (loginAttempt) => {
  if (!loginAttempt || !loginAttempt.lockedUntil) {
    return { isLocked: false, remainingMinutes: 0 };
  }
  const lockedUntilMs = new Date(loginAttempt.lockedUntil).getTime();
  const nowMs = Date.now();
  if (lockedUntilMs > nowMs) {
    const remainingMinutes = Math.ceil((lockedUntilMs - nowMs) / (60 * 1000));
    return { isLocked: true, remainingMinutes, lockedUntil: loginAttempt.lockedUntil };
  }
  return { isLocked: false, remainingMinutes: 0 };
};

/**
 * Tính số lần thử còn lại và thời gian khóa nếu vượt quá giới hạn
 */
export const recordFailedAttempt = (currentAttempt) => {
  const count = ((currentAttempt?.lockedUntil && new Date(currentAttempt.lockedUntil).getTime() <= Date.now()) ? 0 : (currentAttempt?.count || 0)) + 1;
  const isLockingNow = count >= MAX_FAILED_ATTEMPTS;
  const lockedUntil = isLockingNow
    ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000).toISOString()
    : null;
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - count);

  return {
    count: isLockingNow ? 0 : count,
    lockedUntil,
    remaining,
    isLockingNow,
  };
};
