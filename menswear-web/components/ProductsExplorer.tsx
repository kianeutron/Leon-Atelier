'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, Category } from '../lib/types'
import { SortFilterBar, SortKey } from './SortFilterBar'
import { ProductCard } from './ProductCard'
import { fetchFirstPriceForProduct } from '../lib/api'

export function ProductsExplorer({
  initial,
  categories,
  initialCategoryId = '',
}: {
  initial: Product[]
  categories: Category[]
  initialCategoryId?: string
}) {
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [sort, setSort] = useState<SortKey>('newest')

  const [priceMap, setPriceMap] = useState<Record<string, number>>({})

  // Prefetch prices lazily when user selects a price sort or price filter
  useEffect(() => {
    if ((sort === 'price_asc' || sort === 'price_desc') && initial.length) {
      let cancelled = false
      ;(async () => {
        const entries = await Promise.all(
          initial.map(async (p) => {
            if (priceMap[p.Id] != null) return [p.Id, priceMap[p.Id]] as const
            const price = await fetchFirstPriceForProduct(p.Id).catch(() => null)
            return [p.Id, price?.AmountCents ?? Number.MAX_SAFE_INTEGER] as const
          })
        )
        if (!cancelled) {
          const next: Record<string, number> = {}
          for (const [id, cents] of entries) next[id] = cents
          setPriceMap(next)
        }
      })()
      return () => {
        cancelled = true
      }
    }
  }, [sort, initial, priceMap])

  const filtered = useMemo(() => {
    const byText = (p: Product) => {
      const t = `${p.Title} ${p.Subtitle ?? ''}`.toLowerCase()
      const needle = q.trim().toLowerCase()
      return !needle || t.includes(needle)
    }
    const byCategory = (p: Product) => {
      if (!categoryId) return true
      return p.CategoryId === categoryId
    }
    return initial.filter((p) => byText(p) && byCategory(p))
  }, [initial, q, categoryId])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'newest') {
      arr.sort((a, b) => new Date(b.Created_At).getTime() - new Date(a.Created_At).getTime())
    } else if (sort === 'title') {
      arr.sort((a, b) => a.Title.localeCompare(b.Title))
    } else if (sort === 'price_asc' || sort === 'price_desc') {
      arr.sort((a, b) => {
        const pa = priceMap[a.Id] ?? Number.MAX_SAFE_INTEGER
        const pb = priceMap[b.Id] ?? Number.MAX_SAFE_INTEGER
        return sort === 'price_asc' ? pa - pb : pb - pa
      })
    }
    return arr
  }, [filtered, sort, priceMap])

  return (
    <div className="space-y-6">
      <SortFilterBar
        value={{ q, categoryId, sort }}
        onChange={(v) => {
          if (v.q !== undefined) setQ(v.q)
          if (v.categoryId !== undefined) setCategoryId(v.categoryId)
          if (v.sort !== undefined) setSort(v.sort)
        }}
        categories={categories}
      />

      {/* Results meta */}
      <div className="flex items-center justify-between text-sm text-brown/70">
        <div>{sorted.length} results</div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
        >
          {sorted.map((p) => (
            <motion.div
              key={p.Id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
