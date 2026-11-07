
import { adminAuth } from '../config/firebaseAdmin.js';

export async function verifyFirebaseToken(req, res) {
  const authorization = req.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Missing Firebase ID Token'
    });
  }

  const idToken = authorization.slice(7).trim();

  if (!idToken) {
    return res.status(401).json({
      success: false,
      message: 'Empty Firebase ID Token'
    });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    return res.status(200).json({
      success: true,
      message: 'Firebase token verified',
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        emailVerified: decoded.email_verified ?? false
      }
    });
    } catch (error) {
    console.error('Firebase verification error:', {
        code: error.code,
        message: error.message
    });

    return res.status(401).json({
        success: false,
        message: 'Firebase token verification failed'
    });
    }
}
