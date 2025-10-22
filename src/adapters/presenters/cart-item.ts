import { CartItem } from '~/domain/cart/entities/cart-item'

import { ProductPresenter } from './product'

export class CartItemPresenter {
  static toJSON(cartItem: CartItem) {
    return {
      id: cartItem.id,
      cartId: cartItem.cartId,
      product: ProductPresenter.toJSON(cartItem.product),
      name: cartItem.name,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
    }
  }
}
