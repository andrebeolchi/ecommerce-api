import { mock, MockProxy } from 'jest-mock-extended'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'

import { cartFactory, cartItemFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { GetCartUseCase } from './get-cart-use-case'

describe('[use-case] get cart', () => {
  let getCartUseCase: GetCartUseCase

  let cartRepository: MockProxy<CartRepository>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    cartRepository = mock<CartRepository>()
    logger = mock<Logger>()

    getCartUseCase = new GetCartUseCase(logger, cartRepository)
  })

  it('should get cart successfully', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    cartRepository.findCartByUserId.mockResolvedValueOnce(cart)

    const result = getCartUseCase.execute(user.id)

    await expect(result).resolves.toEqual(cart)
  })

  it('should throw NotFoundError if cart not found', async () => {
    const user = userFactory.build()
    cartRepository.findCartByUserId.mockResolvedValueOnce(null)

    const result = getCartUseCase.execute(user.id)

    await expect(result).rejects.toThrow('cart not found')
  })
})
