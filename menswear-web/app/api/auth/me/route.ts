import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('session')?.value
  if (!token) return NextResponse.json({ user: null })
  const base = process.env.AUTH_API_URL || 'http://localhost:5252'
  try {
    const res = await fetch(`${base}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ user: null })
    const data = await res.json().catch(() => ({ user: null }))
    return NextResponse.json({ user: data?.user ?? null })
  } catch {
    return NextResponse.json({ user: null })
  }
}
