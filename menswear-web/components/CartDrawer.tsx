'use client'

import Link from 'next/link'
import { useUI } from '../store/ui'
import { useCart } from '../store/cart'
import { formatMoney } from '../lib/format'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Tag, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const { items, remove, totalCents, clear } = useCart()
  const startX = useRef<number | null>(null)
  const [promo, setPromo] = useState('')
  const [promoMsg, setPromoMsg] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [discountCents, setDiscountCents] = useState(0)

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cartOpen) closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, closeCart])

  const subtotal = totalCents()
  const freeShipThreshold = 15000 // $150.00
  const isFreeShip = appliedCode === 'FREESHIP'
  const effectiveSubtotal = Math.max(0, subtotal - discountCents)
  const freeShipPct = isFreeShip
    ? 100
    : Math.min(100, Math.round((effectiveSubtotal / freeShipThreshold) * 100))

  function applyPromo() {
    setPromoMsg(null)
    setPromoError(null)
    const code = promo.trim().toUpperCase()
    if (!code) {
      setPromoError('Enter a promo code')
      return
    }
    if (appliedCode) {
      setPromoError('A code is already applied')
      return
    }
    // Demo validation rules
    if (code === 'WELCOME10') {
      const tenPct = Math.floor(subtotal * 0.1)
      const capped = Math.min(tenPct, 5000) // max $50
      if (capped <= 0) {
        setPromoError('Cart is empty')
        return
      }
      setDiscountCents(capped)
      setAppliedCode(code)
      setPromoMsg('WELCOME10 applied: 10% off (up to $50)')
    } else if (code === 'SAVE20') {
      if (subtotal < 2000) {
        setPromoError('Minimum subtotal $20 required')
        return
      }
      setDiscountCents(2000)
      setAppliedCode(code)
      setPromoMsg('SAVE20 applied: $20 off')
    } else if (code === 'FREESHIP') {
      setDiscountCents(0)
      setAppliedCode(code)
      setPromoMsg('Free shipping unlocked')
    } else {
      setPromoError('Code not recognized')
    }
  }

  function removePromo() {
    setAppliedCode(null)
    setDiscountCents(0)
    setPromoMsg(null)
    setPromoError(null)
    setPromo('')
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-cream border-l border-sand shadow-2xl flex flex-col"
            onTouchStart={(e) => {
              startX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              const sx = startX.current
              const dx = e.changedTouches[0].clientX - (sx ?? 0)
              if (sx !== null && dx > 60) closeCart()
              startX.current = null
            }}
          >
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-sand flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl md:text-2xl text-brownDark">Your bag</h2>
                <p className="text-xs md:text-sm text-brown/70">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-md p-2 hover:bg-sand/60 text-brown"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping progress */}
            <div className="px-4 md:px-5 py-3 border-b border-sand bg-cream/60">
              <div className="flex items-center gap-2 text-brown/80 text-sm">
                <Truck size={16} />{' '}
                {isFreeShip ? (
                  <span>You’ve unlocked free shipping</span>
                ) : effectiveSubtotal < freeShipThreshold ? (
                  <span>
                    {formatMoney(freeShipThreshold - effectiveSubtotal)} away from free shipping
                  </span>
                ) : (
                  <span>You’ve unlocked free shipping</span>
                )}
              </div>
              <div className="mt-2 h-2 rounded-full bg-sand/50 overflow-hidden">
                <div className="h-full bg-brown" style={{ width: `${freeShipPct}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-14">
                  <div className="mx-auto h-16 w-16 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,111,85,0.18),transparent_60%)]" />
                  <p className="mt-4 text-brown/80">Your cart is empty.</p>
                </div>
              ) : (
                items.map((i) => (
                  <div
                    key={i.id}
                    className="grid grid-cols-[64px_1fr_auto] gap-3 items-center rounded-xl border border-sand bg-cream/70 p-3"
                  >
                    {/* thumb */}
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-sand/50 flex items-center justify-center text-brown/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {(i as any).image || (i as any).img ? (
                        <img
                          src={(i as any).image ?? (i as any).img}
                          alt={i.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">{i.title?.slice(0, 1)}</span>
                      )}
                    </div>
                    {/* info */}
                    <div>
                      <div className="text-brownDark leading-tight">{i.title}</div>
                      {(i as any).variantId && (
                        <div className="text-xs text-brown/70">Size {(i as any).variantId}</div>
                      )}
                      <div className="text-xs text-brown/70">Qty {i.qty}</div>
                    </div>
                    {/* price + remove */}
                    <div className="text-right">
                      <div className="text-brownDark">{formatMoney(i.priceCents * i.qty)}</div>
                      <button
                        onClick={() => remove(i.id)}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-brown/70 hover:text-brownDark"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo code */}
            <div className="px-4 md:px-5 pb-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/60">
                  <Tag size={16} />
                </div>
                <input
                  value={promo}
                  disabled={!!appliedCode}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Promo code"
                  className="w-full rounded-md border border-sand bg-cream pl-9 pr-32 py-2.5 text-sm text-brown outline-none focus:ring-2 focus:ring-brown/30 disabled:opacity-60"
                />
                {appliedCode ? (
                  <button
                    onClick={removePromo}
                    className="absolute right-1.5 top-1.5 rounded-md bg-sand px-3 py-1.5 text-sm text-brown hover:bg-sand/70"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={applyPromo}
                    className="absolute right-1.5 top-1.5 rounded-md bg-brown text-cream px-3 py-1.5 text-sm hover:bg-brownDark"
                  >
                    Apply
                  </button>
                )}
              </div>
              {promoMsg && <p className="mt-2 text-sm text-emerald-700">{promoMsg}</p>}
              {promoError && <p className="mt-2 text-sm text-red-700">{promoError}</p>}
            </div>

            {/* Totals sticky footer */}
            <div className="sticky bottom-0 z-10 border-t border-sand bg-cream px-4 md:px-5 py-4">
              <div className="flex items-center justify-between text-brownDark">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {discountCents > 0 && (
                <div className="mt-1 flex items-center justify-between text-brown/80">
                  <span>Discount {appliedCode ? `(${appliedCode})` : ''}</span>
                  <span>-{formatMoney(discountCents)}</span>
                </div>
              )}
              {isFreeShip && (
                <p className="mt-1 text-xs text-emerald-700">Free shipping will be applied</p>
              )}
              <div className="mt-2 flex items-center justify-between text-brownDark">
                <span>Total</span>
                <span>{formatMoney(effectiveSubtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-brown/60">
                Taxes and shipping calculated at checkout.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={clear}
                  className="px-4 py-2 border border-brown text-brown rounded-md hover:bg-sand/60"
                >
                  Clear
                </button>
                <Link
                  href="/register"
                  onClick={closeCart}
                  className="flex-1 px-4 py-2 bg-brown text-cream rounded-md hover:bg-brownDark text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
