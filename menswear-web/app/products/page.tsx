import { fetchProducts, fetchCategories } from '../../lib/api'
import { AnimatedHeading } from '../../components/AnimatedHeading'
import { ScrollReveal } from '../../components/ScrollReveal'
import { ProductsExplorer } from '../../components/ProductsExplorer'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Products | Léon Atelier'
}

export default async function ProductsPage() {
  const data = await fetchProducts({ top: 60, filter: 'Active eq true', orderby: 'Created_At desc' }).catch(() => ({ value: [] }))
  const cats = await fetchCategories({ orderby: 'Name asc' }).catch(() => ({ value: [] }))
  const hdrs = headers()
  const url = new URL(hdrs.get('x-url') || 'http://localhost')
  const slug = url.searchParams.get('category')
  const initialCategoryId = slug ? (cats.value.find(c => c.Slug === slug)?.Id ?? '') : ''
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <ScrollReveal>
        <div className="mb-8">
          <AnimatedHeading>All Products</AnimatedHeading>
        </div>
      </ScrollReveal>
      {data.value.length === 0 ? (
        <p className="text-brown/70">No products yet.</p>
      ) : (
        <ProductsExplorer initial={data.value} categories={cats.value} initialCategoryId={initialCategoryId} />
      )}
    </div>
  )
}
