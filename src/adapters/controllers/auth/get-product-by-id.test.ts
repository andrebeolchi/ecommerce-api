import { mock } from 'jest-mock-extended'

import { GetProductByIdUseCase } from '~/domain/catalog/application/use-cases/get-product-by-id-use-case'

import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { productFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { GetProductByIdController, Params } from './get-product-by-id'

describe('[controller] get product by id', () => {
  const getProductByIdUseCase = mock<GetProductByIdUseCase>()
  const logger = mock<Logger>()
  const schemaValidator = mock<SchemaValidator<Params>>()

  const getProductByIdController = new GetProductByIdController(logger, getProductByIdUseCase, schemaValidator)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and product data on successful retrieval', async () => {
    const request = {
      params: {
        id: 'product-123',
      },
    }

    const mockProduct = productFactory.build()

    schemaValidator.execute.mockReturnValue({
      data: request.params,
      errors: [],
    })

    getProductByIdUseCase.execute.mockResolvedValue(mockProduct)

    const response = await getProductByIdController.execute(request)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockProduct)
  })

  it('should return 400 if validation fails', async () => {
    const request = {
      params: {
        id: 1,
      },
    }

    schemaValidator.execute.mockReturnValue({
      //@ts-expect-error testing invalid data
      data: request.params,
      errors: [{ message: 'ID is required' }],
    })

    //@ts-expect-error testing invalid data
    const response = await getProductByIdController.execute(request)

    expect(response.status).toBe(400)
    expect(response.body).toEqual([{ message: 'ID is required' }])
  })
})
