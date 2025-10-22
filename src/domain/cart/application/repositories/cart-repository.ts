import { User } from '~/domain/auth/entities/user'
import { Cart } from '~/domain/cart/entities/cart'
import { CartItem } from '~/domain/cart/entities/cart-item'
import { Product } from '~/domain/catalog/entities/product'

export interface CreateCartParams {
  userId: User['id']
  productId: Product['id']
  quantity: CartItem['quantity']
}

export interface UpdateCartParams {
  cartItemId: CartItem['id']
  quantity: number
}

export interface FindCartByUserIdAndProductIdParams {
  userId: User['id']
  productId: Product['id']
}

export interface CartRepository {
  createCart(cart: Cart): Promise<Cart>
  findCartByUserId(userId: User['id']): Promise<Cart | null>

  createCartItem(params: CartItem): Promise<CartItem>
  updateCartItem(params: CartItem): Promise<CartItem>
  removeCartItem(cartItemId: CartItem['id']): Promise<void>
  findCartItemByUserIdAndProductId(params: FindCartByUserIdAndProductIdParams): Promise<CartItem | null>
}
