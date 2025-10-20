'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function EditorialSplit() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24">
      {/* background accent */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-[380px] w-[92%] rounded-3xl bg-[radial-gradient(700px_240px_at_10%_20%,rgba(201,111,85,0.08),transparent)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Collage image column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* main image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://shop.mango.com/assets/rcs/pics/static/T1/fotos_alt/S/17088272_30_01_D5.jpg?imwidth=2048&imdensity=1&ts=1760461828000"
            alt="Modern knit and tailored layers"
            className="w-full rounded-2xl border border-sand object-cover aspect-[4/5] shadow-soft"
          />
          {/* floating detail tile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="absolute -right-4 -bottom-6 w-[44%] rounded-xl overflow-hidden border border-sand shadow-soft bg-cream/80 backdrop-blur"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://shop.mango.com/assets/rcs/pics/static/T1/fotos_alt/S/17088272_30_01_D5.jpg?imwidth=1200&imdensity=1&ts=1760461828000"
              alt="Detail view"
              className="h-40 w-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Copy column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sand/70 bg-cream/80 px-3 py-1 text-xs tracking-wide text-brown/80">
            Editor’s pick
          </span>
          <h3 className="mt-4 font-display text-3xl md:text-4xl text-brownDark leading-tight">
            Everyday ease, elevated
          </h3>
          <p className="mt-4 text-brown/80">
            Clean lines and tactile knits built for real life pair, layer, and repeat in warm
            neutrals that always feel considered.
          </p>
          <div className="mt-7">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md border border-sand bg-cream px-5 py-3 text-brown hover:bg-brown hover:text-cream transition"
            >
              Shop the edit
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
