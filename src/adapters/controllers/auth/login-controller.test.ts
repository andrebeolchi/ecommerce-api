import { faker } from '@faker-js/faker'
import { mock } from 'jest-mock-extended'

import { LoginUseCase } from '~/domain/auth/application/use-cases/login-use-case'

import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { Logger } from '~/infra/logger'

import { Body, LoginController } from './login-controller'

describe('[controller] login', () => {
  const loginUserUseCase = mock<LoginUseCase>()
  const schemaValidator = mock<SchemaValidator<Body>>()
  const logger = mock<Logger>()
  const loginController = new LoginController(logger, loginUserUseCase, schemaValidator)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and token on successful login', async () => {
    const request = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    }

    schemaValidator.execute.mockReturnValue({
      data: request.body,
      errors: [],
    })

    loginUserUseCase.execute.mockResolvedValue({
      token: 'mocked-jwt-token',
    })

    const response = await loginController.execute(request)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ token: 'mocked-jwt-token' })
  })

  it('should return 400 if validation fails', async () => {
    const request = {
      body: {
        email: 'invalid-email',
        password: '',
      },
    }

    schemaValidator.execute.mockReturnValue({
      data: request.body,
      errors: [{ message: 'Invalid email format' }],
    })

    const response = await loginController.execute(request)

    expect(response.status).toBe(400)
    expect(response.body).toEqual([{ message: 'Invalid email format' }])
  })
})
