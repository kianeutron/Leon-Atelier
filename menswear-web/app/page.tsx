import {
  fetchProducts,
  fetchFirstPriceForProduct,
  fetchFirstImageForProduct,
  fetchCategories,
  fetchCategoryCover,
} from '../lib/api'
import { resolveImageUrl } from '../lib/images'
import { FeaturedGrid } from '../components/home/FeaturedGrid'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/home/Marquee'
import { CollectionsGrid } from '../components/home/CollectionsGrid'
import { EditorialSplit } from '../components/home/EditorialSplit'
import { Testimonials } from '../components/home/Testimonials'
import { Newsletter } from '../components/home/Newsletter'
import { EditorialDark } from '../components/home/EditorialDark'
import { ScrollReveal } from '../components/ScrollReveal'

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
  const heroSlides = detailed
    .slice(0, 3)
    .map((d) => ({ title: d.product.Title, img: d.image ? resolveImageUrl(d.image) : '' }))
  // SSR prefetch categories and their covers to speed up "Shop by Category"
  const categoriesData = await fetchCategories({ orderby: 'Name asc' }).catch(() => ({
    value: [] as any[],
  }))
  const initialCats = categoriesData.value.filter((c: any) => c.Slug !== 'tops')
  const coverEntries = await Promise.all(
    initialCats.map(async (c: any) => {
      const { imageUrl } = await fetchCategoryCover(c.Id).catch(() => ({ imageUrl: null }))
      return [c.Id, imageUrl] as const
    })
  )
  const initialCovers = Object.fromEntries(coverEntries) as Record<string, string | null>
  return (
    <div>
      <Hero slides={heroSlides} />
      <ScrollReveal>
        <Marquee />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <CollectionsGrid initialCats={initialCats} initialCovers={initialCovers} />
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
