import { VerifyTokenUseCase } from '~/domain/auth/application/use-cases/verify-token-use-case'
import { AddToCartUseCase } from '~/domain/cart/application/use-cases/add-to-cart-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { CartItemPresenter } from '~/adapters/presenters/cart-item'

import { Logger } from '~/infra/logger'

export interface Body {
  productId: string
  quantity: number
}

export interface Headers {
  authorization: string
}

export class AddToCartController {
  constructor(
    private logger: Logger,
    private verifyTokenUseCase: VerifyTokenUseCase,
    private addToCartUseCase: AddToCartUseCase,
    private schemaValidator: SchemaValidator<Body>
  ) {}

  async execute({ body, headers }: Request<Body, undefined, Headers>) {
    try {
      const user = await this.verifyTokenUseCase.execute(headers!.authorization!)

      const { data, errors } = this.schemaValidator.execute(body!)

      if (errors.length) {
        this.logger.warn('validation errors in add to cart request', { errors })
        return {
          status: 400,
          body: errors,
        }
      }

      const result = await this.addToCartUseCase.execute({
        userId: user.id,
        productId: data.productId,
        quantity: data.quantity,
      })

      this.logger.info('product added to cart successfully', {
        userId: user.id,
        productId: data.productId,
        quantity: data.quantity,
      })

      return {
        status: 200,
        body: CartItemPresenter.toJSON(result),
      }
    } catch (error) {
      return errorHandler({ error, logger: this.logger })
    }
  }
}
