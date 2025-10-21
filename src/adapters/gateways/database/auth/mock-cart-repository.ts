import { CartItem } from '~/domain/cart/entities/cart-item'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'

export const mockCartRepository: CartRepository = {
  createCart: async _params => {},
  findCartByUserId: async _userId => [] as CartItem[],
  findCartByUserIdAndProductId: async _params => ({}) as CartItem,
  updateCart: async _params => ({}) as CartItem,
}
