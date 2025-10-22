import { GetProductByIdUseCase } from '~/domain/catalog/application/use-cases/get-product-by-id-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { ProductPresenter } from '~/adapters/presenters/product'

import { Logger } from '~/infra/logger'

export interface Params {
  id: string
}

export class GetProductByIdController {
  constructor(
    private logger: Logger,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private schemaValidator: SchemaValidator<Params>
  ) {}

  async execute({ params }: Request<undefined, Params>) {
    try {
      const { data, errors } = this.schemaValidator.execute(params!)

      if (errors.length) {
        return {
          status: 400,
          body: errors,
        }
      }

      const result = await this.getProductByIdUseCase.execute(data.id)

      return {
        status: 200,
        body: ProductPresenter.toJSON(result),
      }
    } catch (error) {
      return errorHandler({ error, logger: this.logger })
    }
  }
}
