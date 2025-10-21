'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Category } from '../lib/types'

export type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'title'

export function SortFilterBar({
  value,
  onChange,
  categories = [],
}: {
  value: {
    q: string
    categoryId: string
    sort: SortKey
  }
  onChange: (v: Partial<typeof value>) => void
  categories?: Category[]
}) {
  const [q, setQ] = useState(value.q)
  useEffect(() => setQ(value.q), [value.q])
  // Debounce search typing
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== value.q) onChange({ q })
    }, 250)
    return () => clearTimeout(t)
  }, [q, value.q, onChange])
  return (
    <div className="rounded-2xl border border-sand bg-cream/70 backdrop-blur px-3 py-3 md:px-5 md:py-5 shadow-sm">
      <div className="flex flex-wrap items-stretch gap-3 md:gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1 min-w-[220px]">
          <input
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border border-sand bg-cream pl-9 pr-9 py-2.5 text-brown outline-none focus:ring-2 focus:ring-brown/30"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown/50">
            🔍
          </span>
          {q && (
            <button
              aria-label="Clear search"
              onClick={() => {
                setQ('')
                onChange({ q: '' })
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-brown/60 hover:text-brown hover:bg-sand/40 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
        {/* Category chips */}
        <div className="-mx-3 px-3 md:mx-0 md:px-0 overflow-x-auto no-scrollbar flex gap-2 flex-1 items-center">
          <button
            key="all"
            onClick={() => onChange({ categoryId: '' })}
            className={`rounded-full border px-3 py-1.5 text-sm ${!value.categoryId ? 'border-brown bg-brown text-cream' : 'border-sand bg-cream hover:border-brown'}`}
          >
            All
          </button>
          {categories.map((c) => {
            const active = value.categoryId === c.Id
            return (
              <button
                key={c.Id}
                onClick={() => onChange({ categoryId: active ? '' : c.Id })}
                className={`rounded-full border px-3 py-1.5 text-sm ${active ? 'border-brown bg-brown text-cream' : 'border-sand bg-cream hover:border-brown'}`}
              >
                {c.Name}
              </button>
            )
          })}
        </div>
        {/* Sort */}
        <div className="w-full md:w-auto md:ml-auto">
          <select
            value={value.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortKey })}
            className="w-full md:w-auto rounded-md border border-sand bg-cream px-3 py-2.5 text-brown outline-none focus:ring-2 focus:ring-brown/30"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}
