import { mock } from 'jest-mock-extended'

import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { RefreshTokenUseCase } from './refresh-token-use-case'

describe('[use-case] refresh token', () => {
  const userRepository = mock<UserRepository>()
  const jwtProvider = mock<JwtProvider>()
  const logger = mock<Logger>()

  const refreshTokenUseCase = new RefreshTokenUseCase(logger, jwtProvider, userRepository)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should refresh token successfully', async () => {
    const user = userFactory.build()

    jwtProvider.verifyToken.mockResolvedValueOnce({
      userId: user.id,
      email: user.email,
    })

    userRepository.findByEmail.mockResolvedValueOnce(user)
    jwtProvider.generateToken.mockResolvedValueOnce('new-valid-jwt-token')

    const result = await refreshTokenUseCase.execute('Bearer valid-jwt-token')

    expect(result).toStrictEqual({
      userId: user.id,
      email: user.email,
      token: 'new-valid-jwt-token',
    })
  })

  it.todo('should throw error if token is missing')

  it.todo('should throw error if token format is invalid')

  it.todo('should throw error if token is invalid')

  it.todo('should throw error if user does not exist')
})
