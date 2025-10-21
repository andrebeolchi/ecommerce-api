import { User } from '~/domain/auth/entities/user'
import { Cart } from '~/domain/cart/entities/cart'
import { CartItem } from '~/domain/cart/entities/cart-item'
import { Product } from '~/domain/catalog/entities/product'

interface CreateCartParams {
  userId: User['id']
  productId: Product['id']
  quantity: CartItem['quantity']
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
  createCart(id: User['id']): Promise<Cart>
  findCartByUserId(userId: User['id']): Promise<Cart | null>

  createCartItem(params: CreateCartParams): Promise<CartItem>
  updateCartItem(params: UpdateCartParams): Promise<CartItem>
  removeCartItem(cartItemId: CartItem['id']): Promise<void>
  findCartItemByUserIdAndProductId(params: FindCartByUserIdAndProductIdParams): Promise<CartItem | null>
}
