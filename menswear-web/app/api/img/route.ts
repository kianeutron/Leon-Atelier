import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const u = searchParams.get('u')
    if (!u) return new NextResponse('Missing url', { status: 400 })

    // Only allow http/https
    const url = new URL(u)
    if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
      return new NextResponse('Invalid protocol', { status: 400 })
    }

    const upstream = await fetch(url.toString(), {
      cache: 'force-cache',
      headers: {
        // Some CDNs require a UA
        'User-Agent': 'Mozilla/5.0 (compatible; LeonAtelier/1.0)'
      }
    })
    if (!upstream.ok || !upstream.body) return new NextResponse('Upstream error', { status: 502 })

    const headers = new Headers()
    const ct = upstream.headers.get('content-type') || 'image/jpeg'
    headers.set('Content-Type', ct)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new NextResponse(upstream.body, { status: 200, headers })
  } catch (e) {
    return new NextResponse('Error', { status: 500 })
  }
}
