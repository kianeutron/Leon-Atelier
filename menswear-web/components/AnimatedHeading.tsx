"use client"

import { motion } from 'framer-motion'

export function AnimatedHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="font-display text-3xl text-brownDark"
      >
        {children}
      </motion.h2>
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute -bottom-1 left-0 h-[2px] bg-gold"
      />
    </div>
  )
}
