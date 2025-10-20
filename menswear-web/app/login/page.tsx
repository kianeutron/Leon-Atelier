"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login as apiLogin } from '../../lib/authClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiLogin(email, password)
      router.push('/')
      // Ensure the app (including header) sees the updated cookie state
      setTimeout(() => router.refresh(), 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12 bg-cream">
      <div className="w-full max-w-md rounded-xl border border-sand bg-cream/90 shadow-soft p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-brownDark">Sign in</h1>
          <p className="text-sm text-brown/70 mt-1">Welcome back to Léon Atelier.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-sand bg-cream rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-sand bg-cream rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full bg-brown text-cream px-4 py-2 rounded-md hover:opacity-95 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="text-sm text-brown/80 text-center">
            Don't have an account?{' '}
            <Link href="/register" className="text-brownDark underline underline-offset-2 hover:text-brown">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
