import { MockProxy, mock } from 'jest-mock-extended'

import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'
import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { LoginUseCase } from './login-use-case'

describe('[use-case] login user', () => {
  let loginUseCase: LoginUseCase

  let userRepository: MockProxy<UserRepository>
  let passwordHasher: MockProxy<PasswordHasher>
  let jwtProvider: MockProxy<JwtProvider>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    passwordHasher = mock<PasswordHasher>()
    jwtProvider = mock<JwtProvider>()
    logger = mock<Logger>()

    loginUseCase = new LoginUseCase(logger, userRepository, passwordHasher, jwtProvider)
  })

  it('should log in a user successfully', async () => {
    const user = userFactory.build()

    userRepository.findByEmail.mockResolvedValueOnce(user)
    passwordHasher.compare.mockResolvedValueOnce(true)
    jwtProvider.generateToken.mockResolvedValueOnce('valid-jwt-token')

    const result = await loginUseCase.execute({ email: user.email, password: user.password })

    expect(result).toStrictEqual({ token: 'valid-jwt-token' })
  })

  it('should throw error if user not found', async () => {
    const user = userFactory.build()

    userRepository.findByEmail.mockResolvedValueOnce(null)

    const result = loginUseCase.execute({ email: user.email, password: user.password })

    await expect(result).rejects.toThrow('invalid credentials')
  })

  it('should throw error if password is invalid', async () => {
    const user = userFactory.build()

    userRepository.findByEmail.mockResolvedValueOnce(user)
    passwordHasher.compare.mockResolvedValueOnce(false)

    const result = loginUseCase.execute({ email: user.email, password: 'wrong-password' })

    await expect(result).rejects.toThrow('invalid credentials')
  })
})
