import { CartItem } from './cart-item'

export interface Cart {
  id: string
  userId: string

  items: CartItem[]

  createdAt: Date
  updatedAt: Date
}
