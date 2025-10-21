'use client'

import { useEffect, useState } from 'react'
import { Product } from '../../lib/types'
import { fetchProducts } from '../../lib/api'
import { AnimatedHeading } from '../AnimatedHeading'
import { MountReveal, MountStagger, MountFadeUp } from '../MountReveal'
import { ProductCard } from '../ProductCard'

export function FeaturedGrid({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial)

  useEffect(() => {
    let cancelled = false
    if (!initial || initial.length === 0) {
      fetchProducts({ top: 6, filter: 'Active eq true', orderby: 'Created_At desc' })
        .then((d) => {
          if (!cancelled) setProducts(d.value)
        })
        .catch(() => {})
    }
    return () => {
      cancelled = true
    }
  }, [initial])

  return (
    <section id="shop" className="mx-auto max-w-6xl px-4 py-16">
      <MountReveal className="mb-8" y={10}>
        <AnimatedHeading>Featured</AnimatedHeading>
      </MountReveal>
      {!products || products.length === 0 ? (
        <p className="text-brown/70">
          No products yet. Add products to your database to see them here.
        </p>
      ) : (
        <MountStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <MountFadeUp key={p.Id}>
              <ProductCard product={p} />
            </MountFadeUp>
          ))}
        </MountStagger>
      )}
    </section>
  )
}
