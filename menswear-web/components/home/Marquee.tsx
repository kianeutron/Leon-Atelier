"use client"

import { motion } from 'framer-motion'

export function Marquee() {
  const items = [
    'Timeless Cuts',
    'Premium Fabrics',
    'Understated Luxury',
    'Earth Tones',
    'Modern Classic',
  ]
  return (
    <div className="relative border-y border-sand/70 bg-cream overflow-x-hidden">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        className="flex whitespace-nowrap py-3 text-brown/80 will-change-transform"
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="mx-6 tracking-wide">{t}</span>
        ))}
      </motion.div>
      {/* edge fades to soften cut-off and avoid perceived overflow */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-cream to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-cream to-transparent" />
    </div>
  )
}
