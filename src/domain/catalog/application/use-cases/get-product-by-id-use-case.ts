import { NotFoundError } from '~/domain/commons/errors/not-found'

import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

export class GetProductByIdUseCase {
  constructor(
    private logger: Logger,
    private productRepository: ProductRepository
  ) {}

  async execute(productId: string) {
    this.logger.info('fetching product by id', { productId })

    const product = await this.productRepository.findById(productId)

    if (!product) {
      this.logger.warn('product not found', { productId })
      throw new NotFoundError('product not found')
    }

    this.logger.info('product fetched successfully', { productId })

    return product
  }
}
