"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onLogout() {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/login')
    } catch {
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md border border-brown px-3 py-2 text-brown hover:bg-sand/60 disabled:opacity-60"
    >
      {loading ? 'Logging out…' : 'Log out'}
    </button>
  )
}
