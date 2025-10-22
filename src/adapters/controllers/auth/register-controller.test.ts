import { faker } from '@faker-js/faker'
import { mock } from 'jest-mock-extended'

import { RegisterUseCase } from '~/domain/auth/application/use-cases/register-use-case'

import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { Body, RegisterController } from './register-controller'

describe('[controller] register', () => {
  const registerUserUseCase = mock<RegisterUseCase>()
  const schemaValidator = mock<SchemaValidator<Body>>()
  const logger = mock<Logger>()
  const registerController = new RegisterController(logger, registerUserUseCase, schemaValidator)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
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

    const user = userFactory.build()

    registerUserUseCase.execute.mockResolvedValue(user)

    const response = await registerController.execute(request)

    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
      })
    )
    //@ts-expect-error testing that password is not returned
    expect(response.body.password).toBeUndefined()
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

    const response = await registerController.execute(request)

    expect(response.status).toBe(400)
    expect(response.body).toEqual([{ message: 'Invalid email format' }])
  })
})
