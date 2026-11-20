import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils/authHelpers.js'
import { db } from '../repositories/authRepository.js'
import { db as memoryDb } from '../db.js'

export async function loadSemanticProfile(req) {
  const authorization = req.headers?.authorization || ''
  const match = /^Bearer\s+(\S+)$/i.exec(authorization)
  if (!match) return null
  try {
    const payload = jwt.verify(match[1], JWT_SECRET, { algorithms: ['HS256'] })
    const userId = payload.user_id || payload.id || payload.sub
    if (!userId) return null
    const user = (await db.findUserById(userId)) || memoryDb.findUserById(userId)
    if (!user) return null
    return { name: user.name ?? null, display_name: user.display_name ?? user.displayName ?? null, email: user.email ?? null }
  } catch {
    return null
  }
}
