export default function Head() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
  let apiOrigin = ''
  try {
    apiOrigin = apiBase ? new URL(apiBase).origin : ''
  } catch {}
  // Preload first hero image to improve LCP discovery
  const hero0 = 'https://shop.mango.com/assets/rcs/pics/static/T1/fotos/outfit/S/17098265_96-99999999_01.jpg?imwidth=2048&imdensity=1&ts=1759746888972'
  const base = hero0.split('?')[0]
  const query = hero0.includes('?') ? hero0.split('?')[1] : ''
  const widths = [480, 768, 1024, 1280, 1600]
  const srcSet = widths
    .map((w) => `${base}?imwidth=${w}${query ? `&${query.replace(/(^|&)imwidth=\d+/g, '').replace(/^&/, '')}` : ''} ${w}w`)
    .join(', ')
  const sizes = '(min-width: 1280px) 60vw, (min-width: 1024px) 52vw, (min-width: 768px) 50vw, 58vw'
  return (
    <>
      {/* Preconnects to reduce DNS/TLS time for early critical requests */}
      <link rel="preconnect" href="https://shop.mango.com" crossOrigin="anonymous" />
      {apiOrigin ? <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" /> : null}
      {/* Preload hero LCP image */}
      <link
        rel="preload"
        as="image"
        href={hero0}
        {...({ imagesrcset: srcSet, imagesizes: sizes } as Record<string, string>)}
        fetchPriority="high"
        crossOrigin="anonymous"
      />
      {/* Hint browser that we prefer reduced data usage when possible */}
      <meta httpEquiv="Save-Data" content="on" />
    </>
  )
}
