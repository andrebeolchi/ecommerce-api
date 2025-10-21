import { mock, MockProxy } from 'jest-mock-extended'

import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'

import { userFactory } from '~/infra/fixtures'

import { VerifyTokenUseCase } from './verify-token-use-case'

describe('[use-case] verify token', () => {
  let verifyTokenUseCase: VerifyTokenUseCase

  let jwtProvider: MockProxy<JwtProvider>

  beforeEach(() => {
    jwtProvider = mock<JwtProvider>()

    verifyTokenUseCase = new VerifyTokenUseCase(jwtProvider)
  })

  it('should verify token successfully', async () => {
    const token = 'Bearer valid-jwt-token'

    const user = userFactory.build()

    jwtProvider.verifyToken.mockResolvedValueOnce({
      userId: user.id,
      email: user.email,
    })

    const result = await verifyTokenUseCase.execute(token)

    expect(result).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
      })
    )
  })

  it('should throw validation error for invalid token format', async () => {
    const token = 'invalid-token-format'

    const result = verifyTokenUseCase.execute(token)

    expect(result).rejects.toThrow('invalid token format')
  })

  it('should throw unauthorized error for invalid token', async () => {
    const token = 'Bearer invalid-jwt-token'

    jwtProvider.verifyToken.mockResolvedValueOnce(null)

    const result = verifyTokenUseCase.execute(token)

    expect(result).rejects.toThrow('invalid token')
  })

  it('should not return password in the user entity', async () => {
    const token = 'Bearer valid-jwt-token'

    const user = userFactory.build()

    jwtProvider.verifyToken.mockResolvedValueOnce({
      userId: user.id,
      email: user.email,
    })

    const result = await verifyTokenUseCase.execute(token)

    expect(result).toEqual(
      expect.objectContaining({
        password: '',
      })
    )
  })
})
