'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function EditorialDark() {
  return (
    <section className="relative isolate overflow-hidden bg-umberDark text-cream">
      {/* soft vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_20%,rgba(199,161,122,0.09),transparent)]"
      />

      {/* blended image layer (left -> right fade) */}
      <div className="absolute inset-y-0 left-0 w-[88%] md:w-[58%] -z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17037884_TG_D5.jpg?imwidth=2048&imdensity=1&ts=1759399489643"
          alt="Outerwear feature"
          className="h-full w-full object-cover"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, black 75%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 75%, transparent 100%)',
          }}
        />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-umberDark via-transparent to-transparent opacity-70" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="relative md:col-start-2"
        >
          {/* readability shield */}
          <div
            aria-hidden
            className="absolute -inset-4 md:-inset-6 rounded-2xl bg-gradient-to-l from-umberDark/90 via-umberDark/70 to-transparent backdrop-blur-[1px]"
          />
          <h3 className="relative z-10 font-display text-5xl md:text-6xl leading-tight">
            Evening layers in deep umber
          </h3>
          <p className="relative z-10 mt-4 text-cream/90">
            Structured coats and tactile knits designed for cool nights—subtle sheen, clean lines,
            and a warm tonal palette.
          </p>
          <div className="relative z-10 mt-7">
            <Link
              href="/products?category=coats"
              className="inline-flex items-center gap-2 rounded-md bg-cream/95 text-umber px-5 py-3 hover:bg-cream transition border border-cream/80"
            >
              Explore outerwear
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
