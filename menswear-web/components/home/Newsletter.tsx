'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <section className="relative isolate">
      {/* section backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_10%_-10%,rgba(201,111,85,0.07),transparent),radial-gradient(900px_280px_at_100%_120%,rgba(199,161,122,0.08),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-sand to-transparent">
          <div className="rounded-[1rem] border border-sand bg-cream/70 backdrop-blur px-6 py-8 md:px-10 md:py-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
              {/* Copy */}
              <div>
                <span className="inline-block rounded-full border border-sand px-3 py-1 text-xs text-brown/70">
                  Members-only
                </span>
                <h3 className="mt-3 font-display text-3xl md:text-4xl text-brownDark">
                  Join the atelier
                </h3>
                <p className="mt-2 text-brown/80">
                  Access exclusive drops, styling notes, and private invitations—delivered
                  occasionally.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="flex flex-col sm:flex-row gap-3 md:justify-end"
              >
                <div className="flex-1 sm:flex-[0_1_420px] relative">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-sand bg-cream px-5 py-3.5 pr-32 text-brown outline-none focus:ring-2 focus:ring-brown/30"
                  />
                  <button className="absolute right-1.5 top-1.5 h-[44px] rounded-full px-5 bg-brown text-cream hover:bg-brownDark">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-brown/60">No spam. Unsubscribe anytime.</p>
              </form>

              {/* Success state */}
              {sent && (
                <div className="md:col-span-2 -mt-2 text-sm text-brown/75">
                  Thank you—please check your inbox to confirm your subscription.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
