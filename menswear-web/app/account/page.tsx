"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { LogoutButton } from '../../components/LogoutButton'

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return
      if (error || !data.user) {
        router.replace('/login')
        return
      }
      setUser(data.user)
    }).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [router])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-brown/80">Loading account…</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">My account</h1>
      <div className="grid gap-3 w-full rounded-lg border border-sand bg-cream p-4">
        <div><span className="text-brown/70 text-sm">Name</span><div className="text-brownDark">{user?.user_metadata?.first_name ?? '-'} {user?.user_metadata?.last_name ?? ''}</div></div>
        <div><span className="text-brown/70 text-sm">Email</span><div className="text-brownDark">{user?.email}</div></div>
        <div><span className="text-brown/70 text-sm">Verified</span><div className="text-brownDark">{user?.email_confirmed_at ? new Date(user.email_confirmed_at).toLocaleDateString() : 'Pending'}</div></div>
        <div className="pt-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
