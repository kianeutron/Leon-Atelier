import { fetchProductBySlug } from '../../../lib/api'
// import { formatMoney } from '../../../lib/format'
// import Image from 'next/image'
import { resolveImageUrl } from '../../../lib/images'
import Link from 'next/link'
// import { AddToCartButton } from '../../../components/AddToCartButton'
import { ProductDetailClient } from '../../../components/ProductDetailClient'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await fetchProductBySlug(params.slug).catch(() => null)
  return {
    title: data?.product ? `${data.product.Title} | Léon Atelier` : 'Product | Léon Atelier',
  }
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const data = await fetchProductBySlug(params.slug)
  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-brown/70">Product not found.</p>
        <Link href="/products" className="text-brown underline">
          Back to products
        </Link>
      </div>
    )
  }
  const { product, price, image, images } = data
  const imgUrl = image ? resolveImageUrl(image) : undefined
  const imgUrls = images && images.length ? images.map(resolveImageUrl) : imgUrl ? [imgUrl] : []

  return (
    <ProductDetailClient
      productId={product.Id}
      title={product.Title}
      priceCents={price?.AmountCents ?? 0}
      imageUrl={imgUrl}
      images={imgUrls}
      description={product.Description ?? undefined}
      sizes={['XS', 'S', 'M', 'L', 'XL']}
    />
  )
}
