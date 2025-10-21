import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

export class GetProductsUseCase {
  constructor(
    private logger: Logger,
    private productRepository: ProductRepository
  ) {}

  async execute() {
    this.logger.info('fetching all products')

    const products = await this.productRepository.findAll()

    return products
  }
}
