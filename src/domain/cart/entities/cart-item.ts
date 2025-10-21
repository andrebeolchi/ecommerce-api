export interface CartItem {
  id: string
  productId: string

  quantity: number
  price: number

  createdAt: Date
  updatedAt: Date
}
