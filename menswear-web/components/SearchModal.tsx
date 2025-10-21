'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { searchProducts, fetchFirstImageForProduct, fetchFirstPriceForProduct } from '../lib/api'
import { resolveImageUrl } from '../lib/images'
import { useUI } from '../store/ui'
import { Search, X } from 'lucide-react'

export default function SearchModal() {
  const { searchOpen, closeSearch } = useUI()
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<
    {
      Id: string
      Slug: string
      Title: string
      Subtitle?: string | null
      image?: string
      price?: string
    }[]
  >([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Focus input when opening
  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 10)
      return () => clearTimeout(id)
    } else {
      setQ('')
      setResults([])
      setLoading(false)
    }
  }, [searchOpen])

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    if (searchOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, closeSearch])

  // Debounced search
  useEffect(() => {
    if (!searchOpen) return
    const term = q.trim()
    const handle = setTimeout(async () => {
      if (!term) {
        setResults([])
        setLoading(false)
        return
      }
      setLoading(true)
      const res = await searchProducts(term, 8).catch(() => ({ value: [] }))
      // Hydrate preview details
      const hydrated = await Promise.all(
        res.value.map(async (p) => {
          const [img, price] = await Promise.all([
            fetchFirstImageForProduct(p.Id).catch(() => null),
            fetchFirstPriceForProduct(p.Id).catch(() => null),
          ])
          return {
            Id: p.Id,
            Slug: p.Slug,
            Title: p.Title,
            Subtitle: p.Subtitle,
            image: img ? resolveImageUrl(img) : undefined,
            price: price
              ? `${(price.AmountCents / 100).toFixed(2)} ${price.CurrencyCode}`
              : undefined,
          }
        })
      )
      setResults(hydrated)
      setLoading(false)
    }, 220)
    return () => clearTimeout(handle)
  }, [q, searchOpen])

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm"
            onClick={closeSearch}
          />
          {/* Dialog */}
          <motion.div
            key="search-dialog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-3 top-10 z-[61] mx-auto max-w-2xl rounded-2xl border border-sand bg-cream shadow-xl"
            role="dialog"
            aria-modal
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-3 border-b border-sand">
              <Search size={18} className="text-brown" />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none text-brownDark placeholder:text-brown/60"
                placeholder="Search products, descriptions, categories…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                onClick={closeSearch}
                aria-label="Close"
                className="rounded-md p-1 hover:bg-sand/50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!q && <div className="p-4 text-brown/70 text-sm">Type to search…</div>}
              {q && loading && <div className="p-4 text-brown/70 text-sm">Searching…</div>}
              {q && !loading && results.length === 0 && (
                <div className="p-4 text-brown/70 text-sm">No results.</div>
              )}
              {results.length > 0 && (
                <ul className="divide-y divide-sand">
                  {results.map((r) => (
                    <li key={r.Id}>
                      <Link
                        href={`/products/${r.Slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-sand/40"
                        onClick={closeSearch}
                      >
                        <div className="h-14 w-12 shrink-0 overflow-hidden rounded-md border border-sand bg-cream/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.Title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-sand" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-brownDark truncate">{r.Title}</div>
                          {r.Subtitle && (
                            <div className="text-sm text-brown/70 truncate">{r.Subtitle}</div>
                          )}
                        </div>
                        {r.price && <div className="text-sm text-brown/80">{r.price}</div>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
