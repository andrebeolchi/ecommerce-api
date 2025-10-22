import { mock } from 'jest-mock-extended'

import { VerifyTokenUseCase } from '~/domain/auth/application/use-cases/verify-token-use-case'
import { GetCartUseCase } from '~/domain/cart/application/use-cases/get-cart-use-case'

import { CartPresenter } from '~/adapters/presenters/cart'

import { cartFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { GetCartController } from './get-cart-controller'

describe('[controller] get cart', () => {
  const logger = mock<Logger>()
  const verifyTokenUseCase = mock<VerifyTokenUseCase>()
  const getCartUseCase = mock<GetCartUseCase>()

  const getCartController = new GetCartController(logger, verifyTokenUseCase, getCartUseCase)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and cart data on successful retrieval', async () => {
    const user = userFactory.build()
    const cartData = cartFactory.build()

    verifyTokenUseCase.execute.mockResolvedValueOnce(user)
    getCartUseCase.execute.mockResolvedValueOnce(cartData)

    const result = await getCartController.execute({
      headers: {
        authorization: 'Bearer valid-token',
      },
    })

    expect(result.status).toBe(200)
    expect(result.body).toEqual(CartPresenter.toJSON(cartData))
  })
})
