"use client"

import { motion, useInView } from 'framer-motion'
import { Product } from '../lib/types'
import { useQuery } from '@tanstack/react-query'
import { fetchFirstPriceForProduct, fetchFirstImageForProduct } from '../lib/api'
import { formatMoney } from '../lib/format'
import Link from 'next/link'
import { resolveImageUrl } from '../lib/images'
import { useRef } from 'react'

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.2, once: true })
  const { data: price } = useQuery({
    queryKey: ['price', product.Id],
    queryFn: () => fetchFirstPriceForProduct(product.Id),
    enabled: inView,
  })
  const { data: image } = useQuery({
    queryKey: ['product-image', product.Id],
    queryFn: () => fetchFirstImageForProduct(product.Id),
    enabled: inView,
  })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group rounded-xl overflow-hidden bg-sand/40 border border-sand shadow-soft hover:shadow-xl"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Link href={`/products/${product.Slug}`} className="block">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImageUrl(image)}
            alt={image.Alt ?? product.Title}
            className="aspect-[4/5] w-full object-cover bg-sand/70 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="aspect-[4/5] bg-sand/70" />
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link href={`/products/${product.Slug}`} className="text-brownDark truncate hover:underline" title={product.Title}>{product.Title}</Link>
          <span className="text-brown/80">{price ? formatMoney(price.AmountCents, price.CurrencyCode) : '—'}</span>
        </div>
        {product.Subtitle && (
          <p className="text-sm text-brown/70 line-clamp-2">{product.Subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
