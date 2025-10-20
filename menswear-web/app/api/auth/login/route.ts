import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }
    const base = process.env.AUTH_API_URL || 'http://localhost:5252'
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })
    const data = await res.json().catch(()=>({}))
    if (!res.ok) return NextResponse.json({ error: data?.error || 'Invalid credentials' }, { status: res.status })
    const token = data?.token as string | undefined
    if (token) {
      cookies().set('session', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }
    return NextResponse.json({ ok: true, user: data?.user })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
