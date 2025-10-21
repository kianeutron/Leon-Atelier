import { fetchProducts } from '../lib/api'
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
  return (
    <div>
      <Hero />
      <ScrollReveal>
        <Marquee />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <CollectionsGrid />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <EditorialSplit />
      </ScrollReveal>
      <FeaturedGrid initial={data.value} />
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
