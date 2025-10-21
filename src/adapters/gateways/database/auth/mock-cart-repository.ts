import { Cart } from '~/domain/cart/entities/cart'
import { CartItem } from '~/domain/cart/entities/cart-item'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'

export const mockCartRepository: CartRepository = {
  createCart: async _params => {},
  findCartByUserId: async _userId => ({}) as Cart | null,
  findCartItemByUserIdAndProductId: async _params => ({}) as CartItem,
  removeCartItem: async _cartItemId => ({}) as CartItem,
  updateCartItem: async _params => ({}) as CartItem,
}
