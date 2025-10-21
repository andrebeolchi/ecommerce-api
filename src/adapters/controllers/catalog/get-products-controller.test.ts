import { mock } from 'jest-mock-extended'

import { GetProductsUseCase } from '~/domain/catalog/application/use-cases/get-products-use-case'

import { productFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { GetProductsController } from './get-products-controller'

describe('[controller] get products', () => {
  const getProductsUseCase = mock<GetProductsUseCase>()
  const logger = mock<Logger>()

  const getProductsController = new GetProductsController(logger, getProductsUseCase)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and products data on successful retrieval', async () => {
    const products = productFactory.buildList(3)

    getProductsUseCase.execute.mockResolvedValue(products)

    const response = await getProductsController.execute()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(products)
  })
})
