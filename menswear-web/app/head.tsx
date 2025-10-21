export default function Head() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
  let apiOrigin = ''
  try {
    apiOrigin = apiBase ? new URL(apiBase).origin : ''
  } catch {}
  return (
    <>
      {/* Preconnects to reduce DNS/TLS time for early critical requests */}
      <link rel="preconnect" href="https://shop.mango.com" crossOrigin="anonymous" />
      {apiOrigin ? <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" /> : null}
      {/* Hint browser that we prefer reduced data usage when possible */}
      <meta httpEquiv="Save-Data" content="on" />
    </>
  )
}
