export interface Product {
  id: string

  imageUrl: string
  name: string
  description: string
  price: number
  stock: number

  promotionalPrice?: number
  promotionStartsAt?: Date
  promotionEndsAt?: Date

  createdAt: Date
  updatedAt: Date
}
