'use client'

import { motion, useInView } from 'framer-motion'
import { Product } from '../lib/types'
import type { Price, ProductImage } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { fetchFirstPriceForProduct, fetchFirstImageForProduct } from '../lib/api'
import { formatMoney } from '../lib/format'
import Link from 'next/link'
import { resolveImageUrl } from '../lib/images'
import { useRef } from 'react'

export function ProductCard({
  product,
  price: prefetchedPrice,
  image: prefetchedImage,
}: {
  product: Product
  price?: Price | null
  image?: ProductImage | null
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.2, once: true })
  const { data: price } = useQuery({
    queryKey: ['price', product.Id],
    queryFn: () => fetchFirstPriceForProduct(product.Id),
    initialData: prefetchedPrice,
  })
  const { data: image } = useQuery({
    queryKey: ['product-image', product.Id],
    queryFn: () => fetchFirstImageForProduct(product.Id),
    initialData: prefetchedImage,
  })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group relative z-10 rounded-xl overflow-hidden bg-sand/40 border border-sand shadow-soft hover:shadow-xl"
    >
      <Link href={`/products/${product.Slug}`} className="block">
        <div className="relative w-full bg-sand/70" style={{ paddingTop: '125%' }}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(image)}
              alt={image.Alt ?? product.Title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              decoding="async"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
            />
          ) : (
            <div className="absolute inset-0" />
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/products/${product.Slug}`}
            className="text-brownDark truncate hover:underline"
            title={product.Title}
          >
            {product.Title}
          </Link>
          <span className="text-brown/80">
            {price ? formatMoney(price.AmountCents, price.CurrencyCode) : '—'}
          </span>
        </div>
        {product.Subtitle && (
          <p className="text-sm text-brown/70 line-clamp-2">{product.Subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
