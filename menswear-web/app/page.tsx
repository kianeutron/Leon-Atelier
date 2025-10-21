import { fetchProducts, fetchFirstPriceForProduct, fetchFirstImageForProduct, fetchCategories, fetchCategoryCover } from '../lib/api'
import { ProductCard } from '../components/ProductCard'
import { FeaturedGrid } from '../components/home/FeaturedGrid'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/home/Marquee'
import { CollectionsGrid } from '../components/home/CollectionsGrid'
import { EditorialSplit } from '../components/home/EditorialSplit'
import { Testimonials } from '../components/home/Testimonials'
import { Newsletter } from '../components/home/Newsletter'
import { EditorialDark } from '../components/home/EditorialDark'
import { AnimatedHeading } from '../components/AnimatedHeading'
import { ScrollReveal } from '../components/ScrollReveal'
import { MountReveal, MountStagger, MountFadeUp } from '../components/MountReveal'

export default async function HomePage() {
  const data = await fetchProducts({
    top: 6,
    filter: 'Active eq true',
    orderby: 'Created_At desc',
  }).catch(() => ({ value: [] }))
  const detailed = await Promise.all(
    data.value.map(async (p) => {
      const [price, image] = await Promise.all([
        fetchFirstPriceForProduct(p.Id).catch(() => null),
        fetchFirstImageForProduct(p.Id).catch(() => null),
      ])
      return { product: p, price, image }
    })
  )
  // Prefetch categories and covers for "Shop by Category" to avoid client-side N+1 and speed up first paint
  const catsData = await fetchCategories({ orderby: 'Name asc' }).catch(() => ({ value: [] }))
  const initialCategories = catsData.value.filter((c) => c.Slug !== 'tops')
  const coverEntries = await Promise.all(
    initialCategories.map(async (c) => {
      const { imageUrl } = await fetchCategoryCover(c.Id).catch(() => ({ imageUrl: null }))
      return [c.Id, imageUrl] as const
    })
  )
  const initialCovers = Object.fromEntries(coverEntries)

  return (
    <div>
      <Hero />
      <ScrollReveal>
        <Marquee />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <CollectionsGrid initialCategories={initialCategories} initialCovers={initialCovers} />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <EditorialSplit />
      </ScrollReveal>
      <FeaturedGrid initial={data.value} initialDetailed={detailed} />
      <ScrollReveal delay={0.05}>
        <EditorialDark />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <Newsletter />
      </ScrollReveal>
    </div>
  )
}
