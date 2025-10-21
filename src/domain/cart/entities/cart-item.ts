export interface CartItem {
  id: string
  productId: string

  name: string
  quantity: number
  price: number

  createdAt: Date
  updatedAt: Date
}
