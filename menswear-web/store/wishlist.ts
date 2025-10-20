import { create } from 'zustand'

export type WishlistItem = {
  productId: string
  title: string
  image?: string
  slug?: string
}

export type WishlistState = {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistState>((set, get) => ({
  items: [],
  add: (item) => set((s) => {
    if (s.items.some(i => i.productId === item.productId)) return s
    return { items: [...s.items, item] }
  }),
  remove: (productId) => set((s) => ({ items: s.items.filter(i => i.productId !== productId) })),
  has: (productId) => get().items.some(i => i.productId === productId),
  clear: () => set({ items: [] }),
}))

// Persist to localStorage (client only)
if (typeof window !== 'undefined') {
  try {
    const saved = window.localStorage.getItem('la_wishlist_v1')
    if (saved) {
      const parsed = JSON.parse(saved) as WishlistItem[]
      if (Array.isArray(parsed)) {
        useWishlist.setState({ items: parsed })
      }
    }
  } catch {}

  useWishlist.subscribe((state) => {
    try {
      window.localStorage.setItem('la_wishlist_v1', JSON.stringify(state.items))
    } catch {}
  })
}
