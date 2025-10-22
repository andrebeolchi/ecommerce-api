import { jwtVerify } from 'jose'

import { JoseJwtProvider } from './jose-jwt-provider'

jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mocked-jwt-token'),
  })),
  jwtVerify: jest.fn(),
}))

describe('[infra] jose jwt provider', () => {
  const secret = 'my-super-secret'
  const jwtProvider = new JoseJwtProvider(secret)

  describe('generateToken', () => {
    it('should encode a payload and return a JWT string', async () => {
      const payload = { userId: '123' }
      const token = await jwtProvider.generateToken(payload, '2h')

      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })
  })

  describe('verifyToken', () => {
    it('should verifyToken a valid JWT and return the original payload', async () => {
      ;(jwtVerify as jest.Mock).mockResolvedValue({ payload: { userId: '123' } })

      const token = 'valid-token'
      const decoded = await jwtProvider.verifyToken<{ userId: string }>(token)

      expect(decoded).toEqual({ userId: '123' })
    })

    it('should throw ValidationError when decoding an invalid token', async () => {
      ;(jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'))

      await expect(jwtProvider.verifyToken('invalid-token')).rejects.toThrow('Invalid token')
    })
  })
})
