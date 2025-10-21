import { NotFoundError } from '~/domain/commons/errors/not-found'
import { ValidationError } from '~/domain/commons/errors/validation'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

interface EditCartUseCaseInput {
  userId: string
  cartItemId: string
  quantity: number
}

export class EditCartUseCase {
  constructor(
    private logger: Logger,
    private cartRepository: CartRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(input: EditCartUseCaseInput) {
    const cart = await this.cartRepository.findCartByUserId(input.userId)

    if (!cart) {
      this.logger.warn('cart not found', { userId: input.userId })
      throw new NotFoundError('cart not found')
    }

    const cartItem = cart.items.find(item => item.id === input.cartItemId)

    if (!cartItem) {
      this.logger.warn('cart item not found', { cartItemId: input.cartItemId })
      throw new NotFoundError('cart item not found')
    }

    const product = await this.productRepository.findById(cartItem.productId)

    if (!product) {
      this.logger.error('product not found', { productId: cartItem.productId })
      throw new NotFoundError('product not found')
    }

    if (product.stock < input.quantity) {
      this.logger.error('insufficient stock for product', {
        productId: cartItem.productId,
        requestedQuantity: input.quantity,
        availableStock: product.stock,
      })
      throw new ValidationError('insufficient stock for product')
    }

    if (input.quantity <= 0) {
      this.logger.info('removing item from cart as quantity is zero', { cartItemId: input.cartItemId })
      const removedCartItem = await this.cartRepository.removeCartItem(input.cartItemId)

      this.logger.info('cart item removed successfully', {
        userId: input.userId,
        cartId: cart.id,
        cartItemId: removedCartItem.id,
        productId: removedCartItem.productId,
      })

      return null
    }

    const updatedCartItem = await this.cartRepository.updateCartItem({
      cartItemId: input.cartItemId,
      quantity: input.quantity,
    })

    this.logger.info('cart updated successfully', {
      userId: input.userId,
      cartId: updatedCartItem.id,
      cartItemId: updatedCartItem.id,
      productId: updatedCartItem.productId,
      newQuantity: updatedCartItem.quantity,
    })

    return updatedCartItem
  }
}
