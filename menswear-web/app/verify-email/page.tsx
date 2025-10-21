'use client'

// Force dynamic rendering to avoid prerender/export issues on this client-only page
export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] grid place-items-center px-4 py-12 bg-cream">
          <div className="w-full max-w-md rounded-xl border border-sand bg-cream/90 shadow-soft p-6 text-center">
            <h1 className="text-2xl font-semibold text-brownDark mb-2">Verify your email</h1>
            <p className="text-brown/80">Loading…</p>
          </div>
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  )
}

function VerifyEmailInner() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token')
      return
    }
    async function run() {
      try {
        setStatus('verifying')
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          cache: 'no-store',
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setStatus('error')
          setMessage(data?.error || 'Verification failed')
          return
        }
        setStatus('success')
        setMessage('Your email has been verified. You can now sign in.')
      } catch (e: any) {
        setStatus('error')
        setMessage('Something went wrong. Please try the link again.')
      }
    }
    run()
    return () => {}
  }, [searchParams])

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12 bg-cream">
      <div className="w-full max-w-md rounded-xl border border-sand bg-cream/90 shadow-soft p-6 text-center">
        <h1 className="text-2xl font-semibold text-brownDark mb-2">Verify your email</h1>
        {status === 'verifying' && <p className="text-brown/80">Verifying your email address…</p>}
        {status !== 'verifying' && (
          <p className={`text-sm ${status === 'success' ? 'text-emerald-700' : 'text-brown/80'}`}>
            {message}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-md bg-brown text-cream hover:opacity-95">
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-md border border-brown text-brown hover:bg-sand/60"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
