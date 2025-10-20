import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (typeof email !== 'string' || !email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }
    const base = process.env.AUTH_API_URL || 'http://localhost:5252'
    const res = await fetch(`${base}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email }),
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
      const msg = data?.error || data?.title || data?.message || 'Resend failed'
      return NextResponse.json({ error: msg }, { status: res.status || 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}
