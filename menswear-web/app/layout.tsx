import './globals.css'
import { ReactNode } from 'react'
import { cn } from '../lib/utils'
import { Providers } from '../components/Providers'
import { CartDrawer } from '../components/CartDrawer'
import { PageTransition } from '../components/PageTransition'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import SearchModal from '../components/SearchModal'
import SupportChat from '../components/SupportChat'

export const metadata = {
  title: 'Léon Atelier',
  description: 'Classic-modern menswear & essentials',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-cream text-brownDark">
      <body className={cn('min-h-screen antialiased font-body bg-cream')}>
        <Providers>
          <SiteHeader />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
          <SearchModal />
          <CartDrawer />
          <SupportChat />
        </Providers>
      </body>
    </html>
  )
}
