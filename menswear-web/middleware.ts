import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Basic security headers. Tune CSP sources to your needs.
export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5252'
  const apiOrigin = (() => {
    try { return new URL(apiBase).origin } catch { return 'http://localhost:5252' }
  })()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseOrigin = (() => {
    try { return supabaseUrl ? new URL(supabaseUrl).origin : '' } catch { return '' }
  })()

  const connectSources = ["'self'", apiOrigin]
  if (supabaseOrigin) connectSources.push(supabaseOrigin)

  const cspParts = [
    "default-src 'self'",
    // Allow runtime scripts and styles from self only
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    // Images: self + Mango + data/blob for inline/thumbs
    "img-src 'self' https://shop.mango.com data: blob:",
    // Fonts
    "font-src 'self' data:",
    // Media none
    "media-src 'self'",
    // XHR/fetch to API
    `connect-src ${connectSources.join(' ')}`,
    // Frames none
    "frame-src 'none'",
    // Workers, objects
    "object-src 'none'",
    // Base URI
    "base-uri 'self'",
    // Form actions
    "form-action 'self'",
  ]

  const csp = cspParts.join('; ')

  res.headers.set('Content-Security-Policy', csp)
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-site')

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
