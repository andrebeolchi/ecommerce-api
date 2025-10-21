import { User } from '~/domain/auth/entities/user'
import { Cart } from '~/domain/cart/entities/cart'
import { CartItem } from '~/domain/cart/entities/cart-item'
import { Product } from '~/domain/catalog/entities/product'

interface CreateCartParams {
  userId: User['id']
  productId: Product['id']
  quantity: CartItem['quantity']
  price: CartItem['price']
  name: CartItem['name']
}

interface UpdateCartParams {
  cartItemId: CartItem['id']
  quantity: number
}

interface FindCartByUserIdAndProductIdParams {
  userId: User['id']
  productId: Product['id']
}

export interface CartRepository {
  createCart(params: CreateCartParams): Promise<void>
  findCartByUserId(userId: User['id']): Promise<Cart | null>

  removeCartItem(cartItemId: CartItem['id']): Promise<CartItem>
  updateCartItem(params: UpdateCartParams): Promise<CartItem>
  findCartItemByUserIdAndProductId(params: FindCartByUserIdAndProductIdParams): Promise<CartItem | null>
}
