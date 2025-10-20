import type { ProductImage } from './api'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export function resolveImageUrl(img: ProductImage): string {
  if (img.Url) return img.Url
  if (img.StorageBucket && img.StoragePath && SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/${img.StorageBucket}/${img.StoragePath}`
  }
  // Fallback placeholder
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%" height="100%" fill="%23EDE3D8"/></svg>'
}
