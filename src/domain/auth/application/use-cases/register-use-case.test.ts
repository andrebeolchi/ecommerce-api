import { mock, MockProxy } from 'jest-mock-extended'

import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { RegisterUseCase } from './register-use-case'

describe('[use-case] register user', () => {
  let registerUseCase: RegisterUseCase

  let userRepository: MockProxy<UserRepository>
  let passwordHasher: MockProxy<PasswordHasher>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    logger = mock<Logger>()
    passwordHasher = mock<PasswordHasher>()
    userRepository = mock<UserRepository>()

    registerUseCase = new RegisterUseCase(logger, userRepository, passwordHasher)
  })

  it('should create a new user successfully', async () => {
    const { email, password } = userFactory.build()

    userRepository.findByEmail.mockResolvedValueOnce(null)
    passwordHasher.hash.mockResolvedValueOnce('hashed-password')
    userRepository.create.mockImplementationOnce(async user => user)

    const result = await registerUseCase.execute({ email, password })

    expect(result).toEqual(
      expect.objectContaining({
        email,
        password: 'hashed-password',
      })
    )
  })

  it('should not create a user if email already exists', async () => {
    const existingUser = userFactory.build()

    userRepository.findByEmail.mockResolvedValueOnce(existingUser)

    const result = registerUseCase.execute({ email: existingUser.email, password: 'any-password' })

    await expect(result).rejects.toThrow('user already exists')
  })

  it('should hash the password before storing', async () => {
    const { email, password } = userFactory.build()

    userRepository.findByEmail.mockResolvedValueOnce(null)
    passwordHasher.hash.mockResolvedValueOnce('hashed-password')
    const createSpy = userRepository.create.mockImplementationOnce(async user => user)

    await registerUseCase.execute({ email, password })

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'hashed-password',
      })
    )
  })
})
