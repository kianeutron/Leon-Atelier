import { NextRequest } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5252'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const target = `${API_BASE}/odata/${params.path.join('/')}${req.nextUrl.search}`
  const res = await fetch(target, {
    headers: {
      accept: 'application/json',
    },
    cache: 'no-store',
  })
  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  })
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const target = `${API_BASE}/odata/${params.path.join('/')}${req.nextUrl.search}`
  const res = await fetch(target, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: await req.text(),
    cache: 'no-store',
  })
  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  })
}
