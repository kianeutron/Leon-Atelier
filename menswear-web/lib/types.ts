export type Product = {
  Id: string
  Slug: string
  Title: string
  Subtitle?: string | null
  Description?: string | null
  CategoryId?: string | null
  Active: boolean
  Created_At: string
  Updated_At: string
}

export type ODataResponse<T> = {
  '@odata.context'?: string
  '@odata.count'?: number
  value: T[]
}

export type Category = {
  Id: string
  Slug: string
  Name: string
  Description?: string | null
  ParentId?: string | null
  Created_At: string
  Updated_At: string
}
