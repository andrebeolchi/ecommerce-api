import { NotFoundError } from '~/domain/commons/errors/not-found'

import { Product } from '~/domain/catalog/entities/product'

import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

interface GetProductByIdUseCaseDependencies {
  logger: Logger
  productRepository: ProductRepository
}

export const getProductByIdUseCase = async (
  productId: Product['id'],
  { logger, productRepository }: GetProductByIdUseCaseDependencies
) => {
  const product = await productRepository.findById(productId)

  if (!product) {
    logger.warn('product not found', { productId })
    throw new NotFoundError('product not found')
  }

  return product
}
