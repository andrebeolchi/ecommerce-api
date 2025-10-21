import { Product } from '~/domain/catalog/entities/product'

export interface CartItem {
  id: string
  productId: string

  name: string
  quantity: number

  product: Product

  createdAt: Date
  updatedAt: Date
}
