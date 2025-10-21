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

interface EditCartUseCaseDependencies {
  logger: Logger
  cartRepository: CartRepository
  productRepository: ProductRepository
}

export const editCartUseCase = async (
  input: EditCartUseCaseInput,
  { logger, cartRepository, productRepository }: EditCartUseCaseDependencies
) => {
  const cart = await cartRepository.findCartByUserId(input.userId)

  if (!cart) {
    logger.warn('cart not found', { userId: input.userId })
    throw new NotFoundError('cart not found')
  }

  const cartItem = cart.items.find(item => item.id === input.cartItemId)

  if (!cartItem) {
    logger.warn('cart item not found', { cartItemId: input.cartItemId })
    throw new NotFoundError('cart item not found')
  }

  const product = await productRepository.findById(cartItem.productId)

  if (!product) {
    logger.error('product not found', { productId: cartItem.productId })
    throw new NotFoundError('product not found')
  }

  if (product.stock < input.quantity) {
    logger.error('insufficient stock for product', {
      productId: cartItem.productId,
      requestedQuantity: input.quantity,
      availableStock: product.stock,
    })
    throw new ValidationError('insufficient stock for product')
  }

  if (input.quantity <= 0) {
    logger.info('removing item from cart as quantity is zero', { cartItemId: input.cartItemId })
    const removedCartItem = await cartRepository.removeCartItem(input.cartItemId)

    logger.info('cart item removed successfully', {
      userId: input.userId,
      cartId: cart.id,
      cartItemId: removedCartItem.id,
      productId: removedCartItem.productId,
    })

    return null
  }

  const updatedCartItem = await cartRepository.updateCartItem({
    cartItemId: input.cartItemId,
    quantity: input.quantity,
  })

  logger.info('cart updated successfully', {
    userId: input.userId,
    cartId: updatedCartItem.id,
    cartItemId: updatedCartItem.id,
    productId: updatedCartItem.productId,
    newQuantity: updatedCartItem.quantity,
  })

  return updatedCartItem
}
