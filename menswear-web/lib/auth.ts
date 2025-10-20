import crypto from 'crypto'
import { cookies } from 'next/headers'
import { findUserByEmailDB, insertUserDB } from './db'

const AUTH_SECRET = (() => {
  const s = process.env.AUTH_SECRET
  if (process.env.NODE_ENV === 'production') {
    if (!s || s.length < 32)
      throw new Error('AUTH_SECRET must be set to a strong value in production')
    return s
  }
  return s || 'dev-secret-change'
})()

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 32)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const hash = crypto.scryptSync(password, salt, 32)
  return crypto.timingSafeEqual(hash, Buffer.from(hashHex, 'hex'))
}

function sign(data: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex')
}

export function createSession(userId: number): string {
  const ts = Date.now()
  const payload = `${userId}.${ts}`
  const sig = sign(payload)
  return `${payload}.${sig}`
}

export function verifySession(token: string): { valid: boolean; userId?: number } {
  const parts = token.split('.')
  if (parts.length !== 3) return { valid: false }
  const [idStr, ts, sig] = parts
  const payload = `${idStr}.${ts}`
  if (sign(payload) !== sig) return { valid: false }
  const userId = Number(idStr)
  if (!Number.isFinite(userId)) return { valid: false }
  return { valid: true, userId }
}

export function setSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === 'production'
  const name = isProd ? '__Host-session' : 'session'
  cookies().set(name, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearSessionCookie() {
  const isProd = process.env.NODE_ENV === 'production'
  const name = isProd ? '__Host-session' : 'session'
  cookies().set(name, '', { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 0 })
}

export function getSessionUserId(): number | null {
  const isProd = process.env.NODE_ENV === 'production'
  const token = cookies().get(isProd ? '__Host-session' : 'session')?.value
  if (!token) return null
  const v = verifySession(token)
  return v.valid ? (v.userId ?? null) : null
}

export function findUserByEmail(email: string) {
  return findUserByEmailDB(email)
}

export function createUser(
  email: string,
  passwordHash: string,
  first_name?: string,
  last_name?: string
) {
  return insertUserDB(email, passwordHash, first_name, last_name)
}
