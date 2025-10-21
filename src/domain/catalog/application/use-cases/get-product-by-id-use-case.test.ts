import { mock, MockProxy } from 'jest-mock-extended'

import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { productFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { GetProductByIdUseCase } from './get-product-by-id-use-case'

describe('[use-case] get product by id', () => {
  let getProductByIdUseCase: GetProductByIdUseCase

  let productRepository: MockProxy<ProductRepository>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    productRepository = mock<ProductRepository>()
    logger = mock<Logger>()

    getProductByIdUseCase = new GetProductByIdUseCase(logger, productRepository)
  })

  it('should return product when found', async () => {
    const product = productFactory.build()

    productRepository.findById.mockResolvedValueOnce(product)

    const result = getProductByIdUseCase.execute(product.id)

    await expect(result).resolves.toEqual(product)
  })

  it('should throw error when product not found', async () => {
    const productId = 'non-existent-id'

    productRepository.findById.mockResolvedValueOnce(null)

    const result = getProductByIdUseCase.execute(productId)

    await expect(result).rejects.toThrow('product not found')
  })
})
