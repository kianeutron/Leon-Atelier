'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const cards = [
  {
    title: 'Coats',
    subtitle: 'Warm layers',
    href: '/products?category=coats',
    bg: 'https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17095967_35.jpg?imwidth=2048&imdensity=1&ts=1753783481626',
  },
  {
    title: 'Trousers',
    subtitle: 'Tailored fits',
    href: '/products?category=trousers',
    bg: 'https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17068266_32.jpg?imwidth=2048&imdensity=1&ts=1760528120828',
  },
  {
    title: 'Suits',
    subtitle: 'Sharp silhouettes',
    href: '/products?category=suits',
    bg: 'https://shop.mango.com/assets/rcs/pics/static/T1/fotos_alt/S/17095997_56_01_O1.jpg?imwidth=2048&imdensity=1&ts=1755013229000',
  },
  {
    title: 'Essentials',
    subtitle: 'Everyday staples',
    href: '/products?category=essentials',
    bg: 'https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17045150_07_D3.jpg?imwidth=2048&imdensity=1&ts=1757520301545',
  },
]

export default function CollectionsPage() {
  return (
    <div className="relative">
      {/* backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1400px_420px_at_10%_-10%,rgba(201,111,85,0.08),transparent),radial-gradient(1200px_360px_at_100%_120%,rgba(199,161,122,0.10),transparent)]"
      />

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-brownDark">Collections</h1>
            <p className="mt-2 text-brown/70">
              Tailored picks to get you to the right aisle faster.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-4 py-2 text-brown hover:bg-brown hover:text-cream transition"
          >
            View all
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Feature Mosaic */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {/* Left Tall */}
          <CollectionCard c={cards[0]} className="md:col-span-2 aspect-[21/10] md:aspect-[5/4]" />
          {/* Right Stack */}
          <div className="grid grid-rows-2 gap-5 md:gap-6">
            <CollectionCard c={cards[1]} className="aspect-[21/10] md:aspect-auto" />
            <CollectionCard c={cards[2]} className="aspect-[21/10] md:aspect-auto" />
          </div>
        </div>
      </section>

      {/* Full Bleed Banner */}
      <section className="px-0 -mt-2 md:-mt-3">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex justify-center">
            <CollectionCard
              c={cards[3]}
              className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl aspect-[21/10] md:aspect-[21/9] lg:aspect-[21/8] overflow-hidden"
              big
            />
          </div>
        </div>
      </section>

      {/** Removed duplicate grid to keep the page focused and editorial. */}
    </div>
  )
}

function CollectionCard({
  c,
  className = '',
  big = false,
}: {
  c: { title: string; subtitle: string; href: string; bg: string }
  className?: string
  big?: boolean
}) {
  return (
    <Link
      href={c.href}
      aria-label={`Shop ${c.title}`}
      className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-2xl ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -6 }}
        className="relative h-full overflow-hidden rounded-2xl border border-sand bg-cream/60 shadow-sm"
      >
        <motion.img
          src={c.bg}
          alt={c.title}
          className={`h-full w-full object-cover ${big ? '' : 'aspect-[4/5] md:aspect-video'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
        {/* label chip */}
        <div className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream/95 px-4 py-2 shadow-sm backdrop-blur">
            <span className="font-display text-brownDark">{c.title}</span>
            <span className="hidden sm:inline text-brown/70 text-xs">{c.subtitle}</span>
          </div>
          <span className="opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition text-brown/90 text-sm">
            Shop now →
          </span>
        </div>
        {/* hover accents */}
        <div className="absolute -inset-10 z-0 pointer-events-none rounded-[1.25rem] bg-[radial-gradient(320px_220px_at_80%_120%,rgba(201,111,85,0.30),transparent_60%)] opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="absolute -top-12 -right-12 z-0 pointer-events-none h-36 w-36 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,111,85,0.24),transparent_60%)] opacity-0 group-hover:opacity-100 transition duration-500" />
      </motion.div>
    </Link>
  )
}
