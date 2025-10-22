import { VerifyTokenUseCase } from '~/domain/auth/application/use-cases/verify-token-use-case'
import { GetCartUseCase } from '~/domain/cart/application/use-cases/get-cart-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'

import { CartPresenter } from '~/adapters/presenters/cart'

import { Logger } from '~/infra/logger'

export interface Headers {
  authorization: string
}

export class GetCartController {
  constructor(
    private logger: Logger,
    private verifyTokenUseCase: VerifyTokenUseCase,
    private getCartUseCase: GetCartUseCase
  ) {}

  async execute({ headers }: Request<undefined, undefined, Headers>) {
    try {
      const user = await this.verifyTokenUseCase.execute(headers!.authorization!)

      const result = await this.getCartUseCase.execute(user.id)

      this.logger.info('cart retrieved successfully', { userId: user.id })

      return {
        status: 200,
        body: CartPresenter.toJSON(result),
      }
    } catch (error) {
      return errorHandler({ error, logger: this.logger })
    }
  }
}
