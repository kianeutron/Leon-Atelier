export function SiteFooter() {
  const year = new Date().getFullYear()
  const cols = [
    {
      title: 'Shop',
      links: [
        { label: 'Coats', href: '/products?category=coats' },
        { label: 'Trousers', href: '/products?category=trousers' },
        { label: 'Suits', href: '/products?category=suits' },
        { label: 'Essentials', href: '/products?category=essentials' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Journal', href: '#' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'Shipping', href: '#' },
        { label: 'Returns', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
    {
      title: 'Follow',
      links: [
        { label: 'Instagram', href: '#' },
        { label: 'Twitter/X', href: '#' },
        { label: 'Pinterest', href: '#' },
      ],
    },
  ]
  return (
    <footer className="border-t border-sand/70 mt-16 bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="font-display text-2xl text-brownDark">Léon Atelier</div>
            <p className="mt-3 text-brown/70 max-w-xs">Classic-modern menswear in warm neutrals. Tailored layers that work every day.</p>
            <div className="mt-4 text-sm text-brown/60">Join the newsletter → <a className="underline hover:text-brownDark" href="#">Subscribe</a></div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-brownDark/90 font-medium mb-3">{c.title}</div>
              <ul className="space-y-2 text-brown/70">
                {c.links.map(l => (
                  <li key={l.label}><a className="hover:text-brownDark" href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-brown/60">
          <div>© {year} Léon Atelier. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-brownDark">Privacy</a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-brownDark">Terms</a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-brownDark">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
