import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { mockProductRepository } from '~/adapters/gateways/database/auth/mock-product-repository'

import { productFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'
import { mockLogger } from '~/infra/logger/mock'

import { getProductByIdUseCase } from './get-product-by-id-use-case'

describe('[use-case] get product by id', () => {
  let productRepository: ProductRepository
  let logger: Logger

  beforeEach(() => {
    productRepository = mockProductRepository
    logger = mockLogger
  })

  afterEach(() => {
    productRepository = {} as ProductRepository
    logger = {} as Logger
  })

  it('should return product when found', async () => {
    const product = productFactory.build()

    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)

    const result = getProductByIdUseCase(product.id, {
      logger,
      productRepository,
    })

    await expect(result).resolves.toEqual(product)
  })

  it('should throw error when product not found', async () => {
    const productId = 'non-existent-id'

    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null)

    const result = getProductByIdUseCase(productId, {
      logger,
      productRepository,
    })

    await expect(result).rejects.toThrow('product not found')
  })
})
