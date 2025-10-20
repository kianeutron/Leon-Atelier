"use client"

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: any
    const enable = () => {
      // Allow native scroll if no content overflow
      const se = document.scrollingElement || document.documentElement
      if (!se || se.scrollHeight <= window.innerHeight) return
      // Prefer only on precise pointers (desktop/laptop). Touch remains native.
      if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return
      // Ensure vertical scroll is allowed
      document.documentElement.style.overflowY = 'auto'
      document.body.style.overflowY = 'auto'

      ;(async () => {
        try {
          const mod = await import('lenis')
          const Lenis = (mod as any).default ?? mod
          lenis = new Lenis({
            autoRaf: true,
            smoothWheel: true,
            smoothTouch: false,
            duration: 1.0,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          })
        } catch {
          // If lenis fails to load, leave native scrolling as-is
        }
      })()
    }

    // Defer to next frame to avoid hydration race conditions
    const id = requestAnimationFrame(enable)

    return () => {
      cancelAnimationFrame(id)
      try { lenis?.destroy?.() } catch {}
    }
  }, [])

  return null
}
