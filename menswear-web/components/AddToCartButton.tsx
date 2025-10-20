'use client'

import { useCart } from '../store/cart'
import { useUI } from '../store/ui'

export function AddToCartButton({
  title,
  productId,
  priceCents,
  quantity = 1,
  image,
  variantId,
}: {
  title: string
  productId: string
  priceCents: number
  quantity?: number
  image?: string
  variantId?: string
}) {
  const { add } = useCart()
  const { openCart } = useUI()

  function handleAdd() {
    add({ productId, title, priceCents, qty: quantity, image, variantId })
    openCart()
  }

  return (
    <button
      onClick={handleAdd}
      className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-brownDark transition"
    >
      Add to cart
    </button>
  )
}
