import { NotFoundError } from '~/domain/commons/errors/not-found'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'

import { Logger } from '~/infra/logger'

interface GetCartUseCaseDependencies {
  logger: Logger
  cartRepository: CartRepository
}

export const getCartUseCase = async (userId: string, { logger, cartRepository }: GetCartUseCaseDependencies) => {
  const cart = await cartRepository.findCartByUserId(userId)

  if (!cart) {
    logger.info('cart not found', { userId })
    throw new NotFoundError('cart not found')
  }

  logger.info('cart retrieved successfully', { userId, cartId: cart.id })

  return cart
}
