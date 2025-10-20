'use client'

import { motion } from 'framer-motion'

export function Testimonials() {
  const quotes = [
    {
      q: 'Elevated basics that feel premium and pair with everything I own.',
      a: 'Daniel K.',
    },
    {
      q: 'Warm earth tones and soft textures—my new daily uniform.',
      a: 'Marco V.',
    },
    {
      q: 'Minimal, tailored, and comfortable. Subtle luxury done right.',
      a: 'Amin R.',
    },
  ]
  return (
    <section className="relative isolate">
      {/* section backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_50%_-10%,rgba(201,111,85,0.06),transparent),linear-gradient(180deg,rgba(245,239,231,0.85),rgba(245,239,231,0.65))]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h3 className="font-display text-3xl md:text-4xl text-brownDark">What clients say</h3>
            <p className="mt-2 text-brown/70">Real notes from customers who wear it on repeat.</p>
          </div>
        </div>

        {/* mobile: horizontal snap, desktop: grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
        >
          {/* big decorative quote */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-2 hidden md:block select-none text-brown/10 text-[120px] leading-none">
            “
          </div>

          {quotes.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-sand/80 bg-cream/60 backdrop-blur p-6 md:p-7 lg:p-8 shadow-sm overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/60 via-sand to-transparent opacity-70" />
              <div className="absolute right-4 top-3 text-brown/20 text-5xl font-serif">”</div>
              <p className="text-brown/90">“{t.q}”</p>
              <footer className="mt-4 text-sm text-brown/70">— {t.a}</footer>
              <div className="absolute -inset-8 rounded-[1.5rem] bg-[radial-gradient(240px_160px_at_80%_120%,rgba(201,111,85,0.16),transparent_60%)] opacity-0 group-hover:opacity-100 transition" />
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
