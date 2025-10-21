import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password, confirmPassword, firstName, lastName } = await req.json()
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }
    if (password !== confirmPassword)
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'Password too short' }, { status: 400 })

    const base = process.env.AUTH_API_URL || 'http://localhost:5252'
    const res = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
      cache: 'no-store',
    })
    // Capture body safely (handles empty or non-JSON bodies)
    let data: any = {}
    try {
      data = await res.json()
    } catch {
      const raw = await res.text().catch(() => '')
      data = raw ? { message: raw } : {}
    }
    if (!res.ok) {
      const msg = data?.error || data?.title || data?.message || 'Register failed'
      const detail = data?.detail
      return NextResponse.json(
        { error: msg, detail, upstreamStatus: res.status },
        { status: res.status || 500 }
      )
    }

    const user = data?.user
    const needsVerification = !!data?.needsVerification
    // Do not set cookie on register; require verification first
    return NextResponse.json({ ok: true, user, needsVerification })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}
