import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'
import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { mockUserRepository } from '~/adapters/gateways/database/auth/mock-user-repository'

import { userFactory } from '~/infra/fixtures'
import { mockJwtProvider } from '~/infra/jwt-provider/mock'
import { Logger } from '~/infra/logger'
import { mockLogger } from '~/infra/logger/mock'
import { mockPasswordHasher } from '~/infra/password-hasher/mock'

import { loginUseCase } from './login-use-case'

describe('[use-case] login user', () => {
  let userRepository: UserRepository
  let passwordHasher: PasswordHasher
  let jwtProvider: JwtProvider
  let logger: Logger

  beforeEach(() => {
    userRepository = mockUserRepository
    passwordHasher = mockPasswordHasher
    logger = mockLogger
    jwtProvider = mockJwtProvider
  })

  afterEach(() => {
    userRepository = {} as UserRepository
    passwordHasher = {} as PasswordHasher
    logger = {} as Logger
    jwtProvider = {} as JwtProvider
  })

  it('should log in a user successfully', async () => {
    const user = userFactory.build()

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user)
    jest.spyOn(passwordHasher, 'compare').mockResolvedValueOnce(true)
    jest.spyOn(jwtProvider, 'generateToken').mockReturnValueOnce('valid-jwt-token')

    const result = loginUseCase(
      { email: user.email, password: user.password },
      {
        logger,
        userRepository,
        passwordHasher,
        jwtProvider,
      }
    )

    await expect(result).resolves.toEqual({ token: 'valid-jwt-token' })
  })

  it('should throw error if user not found', async () => {
    const user = userFactory.build()

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null)

    const result = loginUseCase(
      { email: user.email, password: user.password },
      {
        logger,
        userRepository,
        passwordHasher,
        jwtProvider,
      }
    )

    await expect(result).rejects.toThrow('invalid credentials')
  })

  it('should throw error if password is invalid', async () => {
    const user = userFactory.build()

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user)
    jest.spyOn(passwordHasher, 'compare').mockResolvedValueOnce(false)

    const result = loginUseCase(
      { email: user.email, password: 'wrong-password' },
      {
        logger,
        userRepository,
        passwordHasher,
        jwtProvider,
      }
    )

    await expect(result).rejects.toThrow('invalid credentials')
  })
})
