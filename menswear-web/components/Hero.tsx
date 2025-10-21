'use client'

import { motion } from 'framer-motion'
import { Instagram, Twitter, Mail } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function Hero({ slides }: { slides: { title: string; img: string }[] }) {
  const [index, setIndex] = useState(0)
  const [paused] = useState(false)
  const progressRef = useRef<HTMLDivElement | null>(null)

  // Preload images once so browser cache is warm (no CORS needed for <img> requests)
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.img
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const next = useCallback(() => {
    setIndex((p) => (p + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    let start = performance.now()
    let raf = 0
    const duration = 6000

    function tick(now: number) {
      if (paused) {
        start = now - (progressRef.current ? +(progressRef.current.dataset.ms || '0') : 0)
        raf = requestAnimationFrame(tick)
        return
      }
      const elapsed = Math.min(now - start, duration)
      if (progressRef.current) {
        progressRef.current.style.width = `${(elapsed / duration) * 100}%`
        progressRef.current.dataset.ms = String(elapsed)
      }
      if (elapsed >= duration) {
        if (progressRef.current) {
          progressRef.current.style.width = '0%'
          progressRef.current.dataset.ms = '0'
        }
        start = performance.now()
        next()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, index, next])

  return (
    <section className="relative overflow-hidden">
      {/* Dark gradient blend (top-left) + subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 400px at 0% 0%, rgba(43,43,43,0.35), rgba(43,43,43,0.12) 40%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1400px_600px_at_50%_120%,rgba(0,0,0,0.06),transparent)]"
      />

      {/* Right background slider (fades to the left) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-[58%] md:w-[50%] lg:w-[52%] xl:w-[60%] overflow-hidden">
          <div className="relative h-full w-full">
            {slides.map((s, i) => {
              // Build responsive srcSet from Mango's imwidth parameter
              const base = s.img.split('?')[0]
              const query = s.img.includes('?') ? s.img.split('?')[1] : ''
              const widths = [480, 768, 1024, 1280, 1600]
              const srcSet = widths
                .map(
                  (w) =>
                    `${base}?imwidth=${w}${query ? `&${query.replace(/(^|&)imwidth=\d+/g, '').replace(/^&/, '')}` : ''} ${w}w`
                )
                .join(', ')
              const sizes =
                '(min-width: 1280px) 60vw, (min-width: 1024px) 52vw, (min-width: 768px) 50vw, 58vw'
              return (
                <motion.img
                  key={i}
                  src={s.img}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover select-none"
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                  srcSet={srcSet}
                  sizes={sizes}
                  initial={false}
                  animate={{
                    opacity: i === index ? 1 : 0,
                    scale: i === index ? 1 : 1.02,
                    x: i === index ? 0 : -6,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    WebkitMaskImage: 'linear-gradient(to left, black 78%, transparent 100%)',
                    maskImage: 'linear-gradient(to left, black 78%, transparent 100%)',
                  }}
                />
              )
            })}
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-cream/30 via-transparent to-transparent" />
        </div>
      </div>

      {/* Decorative rings overlay (left-origin, half-visible) */}
      <svg
        className="absolute z-[1] left-[-220px] xl:left-[-280px] -top-10 w-[900px] h-[900px] opacity-70 hidden xl:block pointer-events-none"
        viewBox="0 0 800 800"
        aria-hidden
      >
        <defs>
          <radialGradient id="rgHero" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#E8DCCD" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#E8DCCD" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#E8DCCD" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="280" cy="320" r="360" fill="url(#rgHero)" />
        <circle
          cx="280"
          cy="320"
          r="300"
          fill="none"
          stroke="#6A4B3A"
          strokeOpacity="0.25"
          strokeWidth="26"
        />
        <circle
          cx="280"
          cy="320"
          r="230"
          fill="none"
          stroke="#C96F55"
          strokeOpacity="0.3"
          strokeWidth="18"
        />
      </svg>

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-8 items-center">
        {/* Left copy */}
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full bg-champagne text-umber text-xs tracking-wide px-3 py-1 mb-4"
          >
            New Season Drop
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-[38px] lg:text-[46px] xl:text-6xl text-brownDark tracking-tight"
          >
            Winter
            <br />
            Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 text-brown/80 max-w-xl md:max-w-md"
          >
            Textured layers and tailored silhouettes in warm cream and deep umber, built for crisp
            evenings and city light.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 flex gap-4"
          >
            <a className="btn-accent" href="#shop">
              Explore More ▷
            </a>
            <a
              className="px-6 py-3 rounded-md bg-brownDark text-cream hover:bg-brown transition border border-sand/50 shadow-sm"
              href="/products"
            >
              Shop All
            </a>
          </motion.div>
          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-10 flex items-center gap-4 text-brown"
          >
            <a href="#" aria-label="Instagram" className="hover:text-brownDark">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-brownDark">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Email" className="hover:text-brownDark">
              <Mail size={18} />
            </a>
          </motion.div>

          {/* Dots under copy */}
          <div className="relative z-10 mt-6 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${i === index ? 'bg-gold' : 'bg-brown/40 hover:bg-brown/70'}`}
              />
            ))}
          </div>
        </div>
        {/* Right column becomes empty space for background image composition */}
        <div className="h-[360px] md:h-[520px] lg:h-[560px]" />
      </div>
    </section>
  )
}
