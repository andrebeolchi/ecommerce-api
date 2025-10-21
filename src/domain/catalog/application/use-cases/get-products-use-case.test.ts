import { mock, MockProxy } from 'jest-mock-extended'

import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { productFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { GetProductsUseCase } from './get-products-use-case'

describe('[use-case] get products', () => {
  let getProductsUseCase: GetProductsUseCase

  let productRepository: MockProxy<ProductRepository>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    productRepository = mock<ProductRepository>()
    logger = mock<Logger>()

    getProductsUseCase = new GetProductsUseCase(logger, productRepository)
  })

  it('should return all products', async () => {
    const products = productFactory.buildList(3)

    productRepository.findAll.mockResolvedValueOnce(products)

    const result = getProductsUseCase.execute()

    await expect(result).resolves.toEqual(products)
  })

  it('should return empty list when no products found', async () => {
    productRepository.findAll.mockResolvedValueOnce([])

    const result = getProductsUseCase.execute()

    await expect(result).resolves.toEqual([])
  })
})
