"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AddToCartButton } from './AddToCartButton'
import { Heart } from 'lucide-react'
import { useWishlist } from '../store/wishlist'
import Link from 'next/link'

export function ProductDetailClient({
  productId,
  title,
  priceCents,
  imageUrl,
  images,
  description,
  sizes = ['XS','S','M','L','XL'],
}: {
  productId: string
  title: string
  priceCents: number
  imageUrl?: string
  images?: string[]
  description?: string
  sizes?: string[]
}) {
  const [activeImg, setActiveImg] = useState(imageUrl ?? images?.[0])
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const { add, remove, has } = useWishlist()
  const wished = has(productId)

  return (
    <section className="relative">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_360px_at_10%_-10%,rgba(201,111,85,0.06),transparent),radial-gradient(1000px_320px_at_100%_120%,rgba(199,161,122,0.08),transparent)]" />

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <nav className="text-sm text-brown/70" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brown">Home</Link></li>
            <li aria-hidden>›</li>
            <li><Link href="/products" className="hover:text-brown">Shop</Link></li>
            <li aria-hidden>›</li>
            <li className="text-brownDark">{title}</li>
          </ol>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-10 items-start">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-sand bg-cream/60 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {activeImg ? (
              <img
                src={activeImg}
                alt={title}
                className="w-full aspect-[4/5] md:aspect-[3/4] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full aspect-[4/5] md:aspect-[3/4] bg-sand" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-3">
            {(images && images.length ? images.slice(0,3) : ([imageUrl].filter(Boolean) as string[]).slice(0,3)).map((u, i) => (
              <button key={i} onClick={()=>setActiveImg(u)} className={`relative overflow-hidden rounded-xl border ${activeImg===u ? 'border-brown' : 'border-sand'} bg-cream/70 hover:border-brown transition`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="thumb" className="w-full aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info panel (sticky on desktop) */}
        <div className="md:sticky md:top-24 lg:top-28">
          <div className="flex items-start justify-between gap-4">
            <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.4}} className="font-display text-3xl md:text-4xl text-brownDark leading-tight">
              {title}
            </motion.h1>
            <button
              aria-label={wished ? 'Open liked' : 'Add to liked'}
              onClick={() => wished ? (window.location.href = '/liked') : add({ productId, title, image: activeImg })}
              className={`rounded-full p-2 border transition ${wished ? 'border-brown text-brown bg-cream' : 'border-sand text-brown hover:border-brown'}`}
              title={wished ? 'Go to liked' : 'Add to liked'}
            >
              <Heart size={18} className={wished ? 'fill-current' : ''} />
            </button>
          </div>
          {wished && (
            <div className="mt-1 text-xs"><Link href="/liked" className="text-brown underline">View in Liked</Link></div>
          )}
          <div className="mt-4 text-2xl md:text-[28px] text-brownDark">${(priceCents/100).toFixed(2)}</div>
          {description && <p className="mt-3 text-brown/80">{description}</p>}

          {/* Sizes */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <div className="text-sm text-brown/80">Select size</div>
              {size && <div className="text-xs text-brown/60">Selected: {size}</div>}
            </div>
            <div className="mt-3 grid grid-cols-4 sm:flex sm:flex-wrap gap-2">
              {sizes.map(s => {
                const disabled = s === 'XS' // demo: pretend XS is sold out
                const active = size===s
                return (
                  <button
                    key={s}
                    onClick={()=>!disabled && setSize(s)}
                    disabled={disabled}
                    className={`rounded-full border px-4 py-2 text-sm transition backdrop-blur select-none ${
                      active ? 'border-brown bg-brown text-cream' : disabled ? 'border-sand/70 bg-cream/60 text-brown/40 cursor-not-allowed' : 'border-sand bg-cream hover:border-brown'
                    }`}
                    aria-pressed={active}
                    aria-disabled={disabled}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            <button className="mt-2 text-xs text-brown underline underline-offset-4">Size guide</button>
          </div>

          {/* Quantity + Add */}
          <div className="mt-6 flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-sand bg-cream overflow-hidden">
              <button onClick={()=>setQty(q => Math.max(1, q-1))} className="px-3 py-2 text-brown hover:bg-sand/50">−</button>
              <span className="px-4 py-2 min-w-[2ch] text-center text-brownDark">{qty}</span>
              <button onClick={()=>setQty(q => Math.min(9, q+1))} className="px-3 py-2 text-brown hover:bg-sand/50">+</button>
            </div>
            <div className="flex-1">
              <AddToCartButton
                title={title}
                productId={productId}
                priceCents={priceCents}
                quantity={qty}
                image={activeImg}
                variantId={size ?? undefined}
              />
              {!size && (
                <p className="mt-2 text-xs text-red-700">Please select a size.</p>
              )}
            </div>
          </div>

          {/* Accords */}
          <div className="mt-8 divide-y divide-sand border-y border-sand bg-cream/50 rounded-lg">
            <details className="group p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between text-brownDark">Details <span className="text-brown/60 group-open:rotate-180 transition">⌄</span></summary>
              <div className="mt-3 text-brown/80 text-sm">
                {description || 'Soft hand-feel, tailored fit, and durable construction in warm neutrals.'}
              </div>
            </details>
            <details className="group p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between text-brownDark">Shipping & returns <span className="text-brown/60 group-open:rotate-180 transition">⌄</span></summary>
              <div className="mt-3 text-brown/80 text-sm">Free shipping over $150. 30-day returns. Free exchanges.</div>
            </details>
            <details className="group p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between text-brownDark">Care <span className="text-brown/60 group-open:rotate-180 transition">⌄</span></summary>
              <div className="mt-3 text-brown/80 text-sm">Dry clean recommended. Steam to refresh. Avoid direct heat.</div>
            </details>
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1 text-brown/80">30-day returns</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1 text-brown/80">Free exchanges</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1 text-brown/80">Carbon neutral</span>
          </div>
        </div>
      </div>

      {/* Mobile sticky add bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 backdrop-blur md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="text-brownDark font-medium">${(priceCents/100).toFixed(2)}</div>
          <AddToCartButton
            title={title}
            productId={productId}
            priceCents={priceCents}
            quantity={qty}
            image={activeImg}
            variantId={size ?? undefined}
          />
        </div>
      </div>
    </section>
  )
}
