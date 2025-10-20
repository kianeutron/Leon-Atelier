'use client'

import Link from 'next/link'
import { useWishlist } from '../store/wishlist'
import { Trash2 } from 'lucide-react'

export default function LikedClient() {
  const { items, remove, clear } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-brownDark">Liked</h1>
        <p className="mt-4 text-brown/70">You haven’t liked anything yet.</p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md border border-sand bg-cream px-5 py-3 text-brown hover:bg-brown hover:text-cream transition"
          >
            Browse products →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-brownDark">Liked</h1>
          <p className="mt-2 text-brown/70">Your saved products for later.</p>
        </div>
        <button
          onClick={clear}
          className="rounded-full border border-sand px-3 py-1.5 text-brown hover:bg-sand/50"
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-7">
        {items.map((i) => (
          <div
            key={i.productId}
            className="group overflow-hidden rounded-2xl border border-sand bg-cream/60 shadow-sm"
          >
            <Link href={i.slug ? `/products/${i.slug}` : `/products`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {i.image ? (
                <img
                  src={i.image}
                  alt={i.title}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-sand" />
              )}
            </Link>
            <div className="p-4 flex items-center justify-between">
              <div className="pr-2">
                <div className="font-medium text-brownDark truncate">{i.title}</div>
                <Link
                  href={i.slug ? `/products/${i.slug}` : `/products`}
                  className="text-sm text-brown underline"
                >
                  View
                </Link>
              </div>
              <button
                onClick={() => remove(i.productId)}
                className="inline-flex items-center gap-1 rounded-md border border-sand px-2.5 py-1.5 text-sm text-brown hover:bg-sand/60"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
