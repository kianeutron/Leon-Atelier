'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  margin?: string
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 16,
  margin = '-100px 0px -100px 0px',
}: Props) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin }}
      transition={{ duration: prefersReduced ? 0.2 : 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  delay?: number
  interval?: number
}

export function ScrollStagger({ children, className, delay = 0, interval = 0.06 }: StaggerProps) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={prefersReduced ? undefined : 'hidden'}
      whileInView={'show'}
      viewport={{ once: true, amount: 0.1, margin: '-100px 0px -100px 0px' }}
      variants={
        prefersReduced
          ? undefined
          : {
              hidden: { opacity: 1 },
              show: { opacity: 1, transition: { staggerChildren: interval, delayChildren: delay } },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeUp({
  children,
  delay = 0,
  y = 12,
}: {
  children: ReactNode
  delay?: number
  y?: number
}) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      variants={
        prefersReduced
          ? undefined
          : {
              hidden: { opacity: 0, y },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay } },
            }
      }
      initial={prefersReduced ? undefined : 'hidden'}
      animate={prefersReduced ? undefined : undefined}
    >
      {children}
    </motion.div>
  )
}
