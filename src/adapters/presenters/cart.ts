import { Cart } from '~/domain/cart/entities/cart'

import { CartItemPresenter } from './cart-item'

export class CartPresenter {
  static toJSON(cart: Cart) {
    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map(item => CartItemPresenter.toJSON(item)),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    }
  }
}
