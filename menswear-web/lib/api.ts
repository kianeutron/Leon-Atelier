import { ODataResponse, Product, Category } from './types'

function getApiBase(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL
  // In the browser, if served over http(s), use the Next API proxy to guarantee same-origin
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      return '/api'
    }
    // Non-http scheme (e.g., Capacitor), prefer explicit env
    if (env && env.trim()) return env
    return 'http://localhost:5252'
  }
  // On the server, prefer env; otherwise fallback
  if (env && env.trim()) return env
  return 'http://localhost:5252'
}

export async function fetchProducts(params?: {
  top?: number
  filter?: string
  orderby?: string
}): Promise<ODataResponse<Product>> {
  const parts: string[] = []
  if (params?.top) parts.push(`$top=${params.top}`)
  if (params?.filter) parts.push(`$filter=${params.filter}`)
  if (params?.orderby) parts.push(`$orderby=${params.orderby}`)
  const qs = parts.length ? `?${parts.join('&')}` : ''
  const url = `${getApiBase()}/odata/Products${qs}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  return res.json()
}

export async function fetchCategories(params?: {
  top?: number
  orderby?: string
}): Promise<ODataResponse<Category>> {
  const parts: string[] = []
  if (params?.top) parts.push(`$top=${params.top}`)
  if (params?.orderby) parts.push(`$orderby=${params.orderby}`)
  const qs = parts.length ? `?${parts.join('&')}` : ''
  const url = `${getApiBase()}/odata/Categories${qs}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function fetchFirstProductForCategory(categoryId: string): Promise<Product | null> {
  const url = `${getApiBase()}/odata/Products?$top=1&$filter=CategoryId eq ${categoryId} and Active eq true&$orderby=Updated_At desc`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as ODataResponse<Product>
  return data.value[0] ?? null
}

export async function fetchCategoryCover(categoryId: string): Promise<{ imageUrl: string | null }> {
  const prod = await fetchFirstProductForCategory(categoryId)
  if (!prod) return { imageUrl: null }
  const img = await fetchFirstImageForProduct(prod.Id)
  return { imageUrl: img?.Url ?? null }
}

export type Price = {
  Id: string
  ProductId?: string
  VariantId?: string
  CurrencyCode: string
  AmountCents: number
  CompareAtCents?: number | null
}

export async function fetchFirstPriceForProduct(productId: string): Promise<Price | null> {
  const url = `${getApiBase()}/odata/Prices?$top=1&$filter=ProductId eq ${productId}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as ODataResponse<Price>
  return data.value[0] ?? null
}

export type ProductImage = {
  Id: string
  ProductId: string
  VariantId?: string
  Url?: string | null
  StorageBucket?: string | null
  StoragePath?: string | null
  Alt?: string | null
  Position: number
}

export async function fetchFirstImageForProduct(productId: string): Promise<ProductImage | null> {
  const url = `${getApiBase()}/odata/ProductImages?$top=1&$filter=ProductId eq ${productId}&$orderby=Position asc`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as ODataResponse<ProductImage>
  return data.value[0] ?? null
}

export async function fetchImagesForProduct(productId: string): Promise<ProductImage[]> {
  const url = `${getApiBase()}/odata/ProductImages?$filter=ProductId eq ${productId}&$orderby=Position asc`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  const data = (await res.json()) as ODataResponse<ProductImage>
  return data.value
}

export async function fetchProductBySlug(slug: string) {
  const url = `${getApiBase()}/odata/Products?$top=1&$filter=Slug eq '${slug.replace(/'/g, "''")}'`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch product')
  const data = (await res.json()) as ODataResponse<Product>
  const product = data.value[0]
  if (!product) return null
  const [price, image, images] = await Promise.all([
    fetchFirstPriceForProduct(product.Id),
    fetchFirstImageForProduct(product.Id),
    fetchImagesForProduct(product.Id),
  ])
  return { product, price, image, images }
}

export async function searchProducts(q: string, top: number = 8): Promise<ODataResponse<Product>> {
  const term = q.trim().toLowerCase().replace(/'/g, "''")
  if (!term) return { value: [] }
  const filter = `contains(tolower(Title),'${term}') or contains(tolower(Subtitle),'${term}') or contains(tolower(Description),'${term}')`
  const url = `${getApiBase()}/odata/Products?$top=${top}&$filter=${encodeURIComponent(filter)}&$orderby=Created_At desc`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return { value: [] }
  return res.json()
}
