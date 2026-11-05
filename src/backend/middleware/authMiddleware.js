import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/authHelpers.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Yêu cầu xác thực Access Token.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(401).json({ status: 'error', message: 'Access Token không hợp lệ hoặc đã hết hạn.' });
    }
    req.user = userPayload;
    next();
  });
}
