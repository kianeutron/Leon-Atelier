"use client"

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function MountReveal({ children, className, y = 10, delay = 0 }: { children: ReactNode; className?: string; y?: number; delay?: number }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0.2 : 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MountStagger({ children, className, delay = 0, interval = 0.06 }: { children: ReactNode; className?: string; delay?: number; interval?: number }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={prefersReduced ? undefined : 'hidden'}
      animate={'show'}
      variants={prefersReduced ? undefined : { hidden: {}, show: { transition: { staggerChildren: interval, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MountFadeUp({ children, y = 12 }: { children: ReactNode; y?: number }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      variants={prefersReduced ? undefined : { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }}
    >
      {children}
    </motion.div>
  )
}
