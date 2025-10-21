import { NotFoundError } from '~/domain/commons/errors/not-found'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'

import { Logger } from '~/infra/logger'

export class GetCartUseCase {
  constructor(
    private logger: Logger,
    private cartRepository: CartRepository
  ) {}

  async execute(userId: string) {
    const cart = await this.cartRepository.findCartByUserId(userId)

    if (!cart) {
      this.logger.info('cart not found', { userId })
      throw new NotFoundError('cart not found')
    }

    this.logger.info('cart retrieved successfully', { userId, cartId: cart.id })

    return cart
  }
}
