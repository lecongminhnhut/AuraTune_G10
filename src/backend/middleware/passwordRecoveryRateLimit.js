export function passwordRecoveryRateLimit({ maxRequests, windowMs, message }) {
  const windows = new Map();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = windows.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      windows.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        code: 'PASSWORD_RECOVERY_RATE_LIMITED',
        message,
        retry_after_seconds: retryAfter,
      });
    }

    if (windows.size > 1000) {
      for (const [ip, item] of windows) {
        if (item.resetAt <= now) windows.delete(ip);
      }
    }

    return next();
  };
}
