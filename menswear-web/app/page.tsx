import { fetchProducts } from '../lib/api'
import { ProductCard } from '../components/ProductCard'
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
      <section id="shop" className="mx-auto max-w-6xl px-4 py-16">
        <MountReveal className="mb-8" y={10}>
          <AnimatedHeading>Featured</AnimatedHeading>
        </MountReveal>
        {data.value.length === 0 ? (
          <p className="text-brown/70">
            No products yet. Add products to your database to see them here.
          </p>
        ) : (
          <MountStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.value.map((p) => (
              <MountFadeUp key={p.Id}>
                <ProductCard product={p} />
              </MountFadeUp>
            ))}
          </MountStagger>
        )}
      </section>
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
