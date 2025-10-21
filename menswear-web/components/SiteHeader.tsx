'use client'

import Link from 'next/link'
import { useUI } from '../store/ui'
import { Menu, Search, Heart, User, X } from 'lucide-react'
import { HeaderClient } from './HeaderClient'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getUser } from '../lib/authClient'

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [accountHref, setAccountHref] = useState('/register')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    try {
      const u = getUser()
      setAccountHref(u ? '/account' : '/register')
    } catch {
      setAccountHref('/register')
    }
  }, [pathname])

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 border-b border-sand/60 backdrop-blur ${scrolled ? 'bg-cream/70 shadow-soft' : 'bg-cream/40'}`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 ${scrolled ? 'py-3' : 'py-4'} grid grid-cols-[auto_1fr_auto] items-center gap-2 transition-all`}
      >
        {/* Left: brand + hamburger */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 hover:bg-sand/50 transition md:hidden"
          >
            {open ? (
              <X size={18} className="text-brown" />
            ) : (
              <Menu size={18} className="text-brown" />
            )}
          </button>
          <Link
            href="/"
            aria-label="Léon Atelier home"
            className="group flex items-center gap-2 whitespace-nowrap"
          >
            {/* Monogram emblem */}
            <span className="relative grid place-items-center h-7 w-7 rounded-full border border-sand bg-cream shadow-sm overflow-hidden">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,111,85,0.18),transparent_60%)]" />
              <span className="font-display text-[13px] leading-none text-brownDark">LA</span>
            </span>
            {/* Wordmark */}
            <span className="font-display text-lg sm:text-xl tracking-wide bg-gradient-to-r from-brownDark to-brown bg-clip-text text-transparent group-hover:to-brownDark transition-colors">
              Léon Atelier
            </span>
          </Link>
        </div>

        {/* Center: nav */}
        <nav
          aria-label="Primary"
          className="relative hidden md:flex items-center justify-center gap-2 text-brown rounded-full bg-cream/60 px-1 py-1 border border-sand/60"
        >
          {nav.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <div key={item.href} className="relative">
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-sand/80 -z-10 shadow-soft"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Link
                  href={item.href}
                  className="relative px-3 py-1.5 rounded-full hover:text-brownDark focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  {item.label}
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Right: actions */}
        <div className="relative z-10 flex items-center justify-end gap-1 sm:gap-3 text-brown whitespace-nowrap">
          <button
            onClick={() => useUI.getState().openSearch()}
            aria-label="Search"
            className="rounded-md p-2 hover:bg-sand/50 transition"
          >
            <Search size={18} />
          </button>
          <Link
            href="/liked"
            aria-label="Liked"
            className="inline-flex rounded-md p-2 hover:bg-sand/50 transition"
          >
            <Heart size={18} />
          </Link>
          {/* Cart button with count */}
          <HeaderClient />
          <Link
            href={accountHref}
            aria-label="Account"
            className="hidden sm:inline-flex rounded-md p-2 hover:bg-sand/50 transition"
            onClick={async (e) => {
              e.preventDefault()
              const u = getUser()
              router.push(u ? '/account' : '/register')
            }}
          >
            <User size={18} />
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden border-t border-sand/60 bg-cream/95 backdrop-blur"
          >
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
              {nav.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-3 text-brown ${active ? 'bg-sand/60 text-brownDark' : 'hover:bg-sand/40'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/liked"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-brown hover:bg-sand/40"
              >
                Liked
              </Link>
              <button
                onClick={async () => {
                  const u = getUser()
                  setOpen(false)
                  router.push(u ? '/account' : '/register')
                }}
                className="rounded-md px-3 py-3 text-brown hover:bg-sand/40 inline-flex items-center gap-2"
                aria-label="Account"
              >
                <User size={18} />
                Account
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
