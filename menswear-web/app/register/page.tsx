"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // simple client-side checks
      if (!agree) throw new Error('Please accept the Terms')
      if (!email.includes('@')) throw new Error('Enter a valid email')
      if (password.length < 6) throw new Error('Password must be at least 6 characters')
      if (password !== confirmPassword) throw new Error('Passwords do not match')

      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName || null, last_name: lastName || null },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        },
      })
      if (err) {
        if (err.message?.toLowerCase().includes('already registered')) {
          setError('Email already registered. Please sign in or use another email.')
        } else {
          setError(err.message || 'Register failed')
        }
        return
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-12 bg-cream">
      <div className="w-full max-w-lg rounded-xl border border-sand bg-cream/90 shadow-soft p-6">
        <h1 className="text-2xl font-semibold text-brownDark mb-2">Create your account</h1>
        <p className="text-sm text-brown/70 mb-6">Join Léon Atelier to save favorites and enjoy faster checkout.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full border border-sand bg-cream rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full border border-sand bg-cream rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-sand bg-cream rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full border border-sand bg-cream rounded-md px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button type="button" onClick={()=>setShowPwd(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-brown/70 hover:text-brownDark">
                {showPwd ? 'Hide' : 'Show'}
              </button>
              <div className="mt-1 h-1 rounded bg-sand/60 overflow-hidden">
                <div className={`${password.length>=10?'bg-emerald-600':password.length>=6?'bg-amber-600':'bg-red-600'}`} style={{ width: `${Math.min(100, password.length*10)}%`}} />
              </div>
            </div>
            <div className="relative">
              <input
                type={showPwd2 ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full border border-sand bg-cream rounded-md px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button type="button" onClick={()=>setShowPwd2(v=>!v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-brown/70 hover:text-brownDark">
                {showPwd2 ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-brown/80">
            <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} className="h-4 w-4" />
            I agree to the Terms and Privacy Policy.
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-emerald-700 text-sm">Account created successfully. Please check your email for a verification link to activate your account.</div>}
          <div className="flex items-center gap-3">
            <button disabled={loading || success} className="flex-1 bg-brown text-cream px-4 py-2 rounded-md hover:opacity-95 disabled:opacity-60">
              {loading ? 'Creating...' : 'Create account'}
            </button>
            <button type="button" disabled={success} onClick={()=>router.push('/login')} className="px-4 py-2 border border-brown text-brown rounded-md hover:bg-sand/60 disabled:opacity-60">Sign in</button>
          </div>
          {success && (
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={async ()=>{
                  setResendMsg(null)
                  setResendLoading(true)
                  try {
                    const { error: rerr } = await supabase.auth.resend({ type: 'signup', email })
                    if (rerr) throw new Error(rerr.message || 'Could not resend email')
                    setResendMsg('Verification email resent. Please check your inbox (and spam).')
                  } catch (e:any) {
                    setResendMsg(e.message)
                  } finally {
                    setResendLoading(false)
                  }
                }}
                disabled={resendLoading}
                className="w-full px-4 py-2 rounded-md border border-brown text-brown hover:bg-sand/60 disabled:opacity-60"
              >
                {resendLoading ? 'Resending…' : 'Resend verification email'}
              </button>
              {resendMsg && <div className="text-sm text-brown/80">{resendMsg}</div>}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
