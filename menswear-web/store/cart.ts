import { create } from 'zustand'

export type CartItem = {
  id: string
  productId: string
  variantId?: string
  title: string
  priceCents: number
  qty: number
  image?: string
}

export type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'id'>) => void
  remove: (id: string) => void
  clear: () => void
  totalCents: () => number
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, { id: crypto.randomUUID(), ...item }] })),
  remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] }),
  totalCents: () => get().items.reduce((a, i) => a + i.priceCents * i.qty, 0),
}))

// Client-side persistence (no SSR access to localStorage)
if (typeof window !== 'undefined') {
  try {
    const saved = window.localStorage.getItem('la_cart_v1')
    if (saved) {
      const parsed = JSON.parse(saved) as CartItem[]
      if (Array.isArray(parsed)) {
        useCart.setState({ items: parsed })
      }
    }
  } catch {}

  // Sync to localStorage on any cart change
  useCart.subscribe((state) => {
    try {
      window.localStorage.setItem('la_cart_v1', JSON.stringify(state.items))
    } catch {}
  })
}
