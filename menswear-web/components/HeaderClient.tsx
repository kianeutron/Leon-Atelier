'use client'

import { ShoppingBag } from 'lucide-react'
import { useUI } from '../store/ui'
import { useCart } from '../store/cart'

export function HeaderClient() {
  const { toggleCart } = useUI()
  const { items } = useCart()
  const count = items.reduce((a, i) => a + i.qty, 0)

  return (
    <button
      onClick={toggleCart}
      className="relative inline-flex items-center gap-2 text-brown hover:text-brownDark"
    >
      <ShoppingBag size={20} />
      <span>Cart</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-3 rounded-full bg-brown text-cream text-xs px-2 py-0.5">
          {count}
        </span>
      )}
    </button>
  )
}
