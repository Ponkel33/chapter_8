export type CategoryRequestBody = {
  name: string
}

export type PostRequestBody = {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
}