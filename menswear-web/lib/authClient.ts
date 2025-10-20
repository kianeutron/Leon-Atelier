const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5252').replace(/\/$/, '')

export type AuthUser = {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
}

const TOKEN_KEY = 'la_token'
const USER_KEY = 'la_user'

function saveAuth(token: string, user: AuthUser) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {}
}

function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {}
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) as AuthUser : null
  } catch { return null }
}

export async function register(params: { email: string; password: string; firstName?: string; lastName?: string }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  if (!res.ok) {
    const j = await res.json().catch(()=>({}))
    throw new Error(j?.error || 'Register failed')
  }
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const j = await res.json().catch(()=>({}))
  if (!res.ok) throw new Error(j?.error || 'Login failed')
  const token = j.token as string
  const user = j.user as AuthUser
  if (token && user) saveAuth(token, user)
  return { token, user }
}

export async function fetchMe() {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  const j = await res.json().catch(()=>({}))
  return j?.user as AuthUser | null
}

export async function logout() {
  clearAuth()
}
