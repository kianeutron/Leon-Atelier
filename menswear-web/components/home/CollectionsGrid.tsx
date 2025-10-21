'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Category } from '../../lib/types'
import { fetchCategories, fetchCategoryCover } from '../../lib/api'

export function CollectionsGrid({
  initialCategories,
  initialCovers,
}: {
  initialCategories?: Category[]
  initialCovers?: Record<string, string | null>
} = {}) {
  const [cats, setCats] = useState<Category[]>(initialCategories ?? [])
  const [covers, setCovers] = useState<Record<string, string | null>>(initialCovers ?? {})
  const loading = cats.length === 0

  useEffect(() => {
    if (initialCategories && initialCategories.length) return
    let mounted = true
    ;(async () => {
      try {
        const { value } = await fetchCategories({ orderby: 'Name asc' })
        if (!mounted) return
        const filtered = value.filter((c) => c.Slug !== 'tops')
        setCats(filtered)
        const entries = await Promise.all(
          filtered.map(async (c) => {
            const { imageUrl } = await fetchCategoryCover(c.Id)
            return [c.Id, imageUrl] as const
          })
        )
        if (!mounted) return
        setCovers(Object.fromEntries(entries))
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [initialCategories])

  return (
    <section className="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_10%_-10%,rgba(201,111,85,0.07),transparent),radial-gradient(1000px_300px_at_100%_120%,rgba(199,161,122,0.08),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-8 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-brownDark">Shop by Category</h2>
            <p className="mt-2 text-brown/70">
              Tailored picks to get you to the right aisle faster.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1.5 text-brown hover:bg-brown hover:text-cream transition"
          >
            View all
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
          {(loading ? Array.from({ length: 4 }) : cats).map((c: any, i: number) => (
            <Link
              key={loading ? i : c.Id}
              href={loading ? '#' : `/products?category=${encodeURIComponent(c.Slug)}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-2xl"
              aria-label={loading ? 'Loading category' : `Shop ${c.Name}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -8, rotateX: 1.2, rotateY: -1.2 }}
                className="relative overflow-hidden rounded-2xl p-[1.4px] bg-gradient-to-br from-gold/40 via-transparent to-transparent shadow-[0_10px_30px_rgba(38,31,16,0.12)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative h-60 md:h-72 lg:h-80 w-full overflow-hidden rounded-[0.95rem] border border-sand/80 bg-cream/70 backdrop-blur-sm">
                  {loading ? (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sand/30 to-cream/40" />
                  ) : (
                    <>
                      <img
                        src={covers[c.Id] ?? '/placeholder.svg'}
                        alt={c.Name}
                        className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${c.Slug === 'footwear' ? 'object-[center_85%] sm:object-[center_82%] md:object-[center_78%] lg:object-[center_75%]' : 'object-center'}`}
                        loading={i < 2 ? 'eager' : 'lazy'}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent z-0" />
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 z-0"
                        style={{ boxShadow: 'inset 0 0 0 9999px rgba(248,243,236,0.06)' }}
                      />
                      <div className="pointer-events-none absolute -inset-12 rounded-[1.25rem] bg-[radial-gradient(260px_180px_at_80%_120%,rgba(201,111,85,0.28),transparent_60%)] opacity-0 group-hover:opacity-100 transition duration-500 z-0" />
                      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,111,85,0.22),transparent_60%)] opacity-0 group-hover:opacity-100 transition duration-500 z-0" />
                    </>
                  )}

                  {/* Title chip */}
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between z-10">
                    <div className="inline-flex flex-col md:flex-row items-start md:items-center gap-0.5 md:gap-2 rounded-full border border-sand bg-cream/95 px-3 py-1.5 shadow-sm backdrop-blur max-w-[78%]">
                      <span className="font-display text-brownDark text-sm md:text-base leading-snug">
                        {loading ? ' ' : c.Name}
                      </span>
                      {!loading && (
                        <span className="hidden sm:inline text-brown/70 text-[11px] md:text-xs truncate max-w-[140px] sm:max-w-[160px] md:max-w-[200px] leading-snug">
                          {c.Description ?? ''}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Top-right floating Shop badge for better visibility */}
                  {!loading && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-2 rounded-full bg-brown text-cream px-3 py-1.5 shadow-sm/50 ring-1 ring-brown/20">
                        Shop
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  )}
                </div>
                {/* Glow ring */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(201,111,85,0.25),transparent_30%,transparent_70%,rgba(201,111,85,0.25))] mix-blend-multiply"
                />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
