import { GetProductsUseCase } from '~/domain/catalog/application/use-cases/get-products-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'

import { Logger } from '~/infra/logger'

export class GetProductsController {
  constructor(
    private logger: Logger,
    private getProductsUseCase: GetProductsUseCase
  ) {}

  async execute() {
    try {
      const result = await this.getProductsUseCase.execute()

      return {
        status: 200,
        body: result,
      }
    } catch (error) {
      return errorHandler({ error, logger: this.logger })
    }
  }
}
