import { SignJWT, jwtVerify, JWTPayload } from 'jose'

import { ValidationError } from '~/domain/commons/errors/validation'

import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'

export class JoseJwtProvider implements JwtProvider {
  private secretKey: Uint8Array

  constructor(secret: string) {
    this.secretKey = new TextEncoder().encode(secret)
  }

  async generateToken(payload: object, expiresIn?: string | number): Promise<string> {
    const jwt = await new SignJWT(payload as JWTPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(expiresIn || '1h')
      .sign(this.secretKey)

    return jwt
  }

  async verifyToken<T = object>(token: string): Promise<T> {
    try {
      const { payload } = await jwtVerify(token, this.secretKey)
      return payload as T
    } catch {
      throw new ValidationError('Invalid token')
    }
  }
}
