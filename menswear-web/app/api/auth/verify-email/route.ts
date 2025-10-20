import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }
    const base = process.env.AUTH_API_URL || 'http://localhost:5252'
    const res = await fetch(`${base}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    })
    let data: any = {}
    try {
      data = await res.json()
    } catch {
      const raw = await res.text().catch(() => '')
      data = raw ? { message: raw } : {}
    }
    if (!res.ok) {
      const msg = data?.error || data?.title || data?.message || 'Verification failed'
      return NextResponse.json({ error: msg }, { status: res.status || 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}
