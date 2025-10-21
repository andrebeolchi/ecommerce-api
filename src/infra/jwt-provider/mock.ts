import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'

const generateToken = (_: Record<string, unknown>) => 'mocked-jwt-token'
const verifyToken = (_: string) => ({})

export const mockJwtProvider: JwtProvider = {
  generateToken,
  verifyToken,
}
