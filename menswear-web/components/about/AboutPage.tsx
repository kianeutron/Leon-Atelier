"use client"

import { motion } from 'framer-motion'
import { AnimatedHeading } from '../AnimatedHeading'
import { ScrollReveal, ScrollStagger, FadeUp } from '../ScrollReveal'

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Soft background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_360px_at_10%_-10%,rgba(201,111,85,0.06),transparent),radial-gradient(1000px_320px_at_100%_120%,rgba(199,161,122,0.08),transparent)]" />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-10 items-center">
            <div>
              <AnimatedHeading>Our Story</AnimatedHeading>
              <p className="mt-4 text-brown/80 max-w-prose">
                Léon Atelier was founded on a simple premise: timeless design, honest materials, and modern comfort. We craft clothing to live in—pieces that age with grace, travel well, and feel considered in every detail.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1 text-brown/80">Family-owned</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1 text-brown/80">Small batch</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-3 py-1 text-brown/80">Responsibly made</span>
              </div>
            </div>
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-sand bg-cream/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://shop.mango.com/images/sustainability/11.jpg?imdensity=1&im=RegionOfInterestCrop,width=2048,height=1138,regionOfInterest=(2208,1650)" alt="Atelier" className="w-full aspect-[5/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 pt-0 pb-0 md:pt-2 md:pb-2">
        <div className="mb-0 md:mb-2">
          <h2 className="font-display text-2xl md:text-3xl text-brownDark">What we value</h2>
          <p className="mt-1 md:mt-2 text-brown/70 max-w-prose">Design that lasts. Materials with character. And a fit that simply feels right.</p>
        </div>
        <ScrollStagger>
          {/* Compact list on mobile/tablet to save vertical space */}
          <div className="flex flex-col gap-1 md:gap-2 lg:hidden">
            {[{
              title:'Timeless design',
              body:'Clean lines and quiet details—pieces that work across seasons and years.'
            },{
              title:'Natural materials',
              body:'We prioritize breathable, durable fibers with rich hand-feel and drape.'
            },{
              title:'Responsible craft',
              body:'Small-batch production and partners who share our standards.'
            }].map((v,i)=> (
              <FadeUp key={i}>
                <div className="rounded-md border border-sand/80 bg-cream/80 px-3 py-2">
                  <div className="font-medium text-brownDark text-sm">{v.title}</div>
                  <p className="text-brown/80 text-xs leading-snug">{v.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

            {/* Full cards only on large screens */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[{
                title:'Timeless design',
                body:'Clean lines and quiet details—pieces that work across seasons and years.'
              },{
                title:'Natural materials',
                body:'We prioritize breathable, durable fibers with rich hand-feel and drape.'
              },{
                title:'Responsible craft',
                body:'Small-batch production and partners who share our standards.'
              }].map((v,i)=> (
                <FadeUp key={i}>
                  <div className="h-full rounded-2xl border border-sand bg-cream/70 p-5 shadow-sm">
                    <div className="font-medium text-brownDark">{v.title}</div>
                    <p className="mt-2 text-brown/80 text-sm">{v.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </ScrollStagger>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4 pt-0 pb-1 md:pt-1 md:pb-5">
          <div className="mb-0 md:mb-2">
            <h2 className="font-display text-2xl md:text-3xl text-brownDark">Milestones</h2>
            <p className="mt-1 md:mt-2 text-brown/70">Key moments that shaped Léon Atelier.</p>
          </div>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-sand" aria-hidden />
            <div className="space-y-0 sm:space-y-0 md:space-y-3">
              {[{
                year:'2018', title:'First capsule', text:'We launched with five essential pieces built for daily rotation.'
              },{ year:'2020', title:'New atelier', text:'Our workshop expanded to support small-batch tailoring.'
              },{ year:'2023', title:'Carbon offset', text:'We began offsetting our operations with verified climate projects.'
              }].map((t,i)=> (
                <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35, delay:i*0.05}}
                  className="relative pl-10 sm:pl-12">
                  <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-brown" />
                  <div className="text-sm text-brown/70">{t.year}</div>
                  <div className="font-medium text-brownDark">{t.title}</div>
                  <p className="text-brown/80 text-sm max-w-prose">{t.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* Craft */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <ScrollReveal>
          <div className="mb-6 md:mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-brownDark">Craftsmanship</h2>
            <p className="mt-2 text-brown/70 max-w-prose">Tailored construction, hand-finished details, and fabrics chosen for their character and longevity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
            {["https://shop.mango.com/images/sustainability/10.jpg?imdensity=1&im=RegionOfInterestCrop,width=2048,height=1138,regionOfInterest=(1200,805)","https://shop.mango.com/images/sustainability/3.jpg?imdensity=1&im=RegionOfInterestCrop,width=1024,height=1179,regionOfInterest=(892,1200)","https://shop.mango.com/images/sustainability/1.jpg?imdensity=1&im=RegionOfInterestCrop,width=2048,height=1138,regionOfInterest=(0,1560)"].map((src,i)=> (
              <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35}}
                className="relative overflow-hidden rounded-2xl border border-sand bg-cream/60 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="craft" className="w-full aspect-[4/5] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ScrollReveal>
          <div className="rounded-2xl border border-sand bg-cream/70 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-brownDark">Designed to live with you</h3>
              <p className="mt-2 text-brown/70 max-w-prose">Explore the collection and find your next daily staple.</p>
            </div>
            <a href="/products" className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream px-4 py-2 text-brown hover:bg-brown hover:text-cream transition">Shop now →</a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
