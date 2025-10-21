import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { mockUserRepository } from '~/adapters/gateways/database/auth/mock-user-repository'

import { userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'
import { mockLogger } from '~/infra/logger/mock'
import { mockPasswordHasher } from '~/infra/password-hasher/mock'

import { registerUseCase } from './register-use-case'

describe('[use-case] register user', () => {
  let userRepository: UserRepository
  let passwordHasher: PasswordHasher
  let logger: Logger

  beforeEach(() => {
    userRepository = mockUserRepository
    passwordHasher = mockPasswordHasher
    logger = mockLogger
  })

  afterEach(() => {
    userRepository = {} as UserRepository
    passwordHasher = {} as PasswordHasher
    logger = {} as Logger
  })

  it('should create a new user successfully', async () => {
    const { email, password } = userFactory.build()

    const result = registerUseCase(
      { email, password },
      {
        logger,
        userRepository,
        passwordHasher,
      }
    )

    await expect(result).resolves.toBeUndefined()
  })

  it('should not create a user if email already exists', async () => {
    const existingUser = userFactory.build()

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(existingUser)

    const result = registerUseCase(
      { email: existingUser.email, password: 'any-password' },
      {
        logger,
        userRepository,
        passwordHasher,
      }
    )

    await expect(result).rejects.toThrow('user already exists')
  })

  it('should hash the password before storing', async () => {
    const { email, password } = userFactory.build()

    jest.spyOn(passwordHasher, 'hash').mockResolvedValueOnce('hashed-password')

    const createSpy = jest.spyOn(userRepository, 'create')

    await registerUseCase(
      { email, password },
      {
        logger,
        userRepository,
        passwordHasher,
      }
    )

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'hashed-password',
      })
    )
  })
})
