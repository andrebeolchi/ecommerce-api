import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'

import { mockCartRepository } from '~/adapters/gateways/database/auth/mock-cart-repository'

import { cartFactory, cartItemFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'
import { mockLogger } from '~/infra/logger/mock'

import { getCartUseCase } from './get-cart-use-case'

describe('[use-case] get cart', () => {
  let cartRepository: CartRepository
  let logger: Logger

  beforeEach(() => {
    cartRepository = mockCartRepository
    logger = mockLogger
  })

  afterEach(() => {
    cartRepository = {} as CartRepository
    logger = {} as Logger
  })

  it('should get cart successfully', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)

    const result = getCartUseCase(user.id, { logger, cartRepository })

    await expect(result).resolves.toEqual(cart)
  })

  it('should throw NotFoundError if cart not found', async () => {
    const user = userFactory.build()
    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(null)

    const result = getCartUseCase(user.id, { logger, cartRepository })

    await expect(result).rejects.toThrow('cart not found')
  })
})
