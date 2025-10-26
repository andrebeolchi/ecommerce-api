import { UnauthorizedError } from '~/domain/commons/errors/unauthorized'
import { ValidationError } from '~/domain/commons/errors/validation'

import { User } from '~/domain/auth/entities/user'

import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'

interface JwtTokenPayload {
  userId: string
  email: string
  createdAt: Date
}

export class VerifyTokenUseCase {
  constructor(private jwtProvider: JwtProvider) {}

  async execute(token?: string): Promise<User> {
    if (!token || !token.startsWith('Bearer ')) {
      throw new ValidationError('invalid token format')
    }

    const [, value] = token.split(' ')

    const decoded = await this.jwtProvider.verifyToken<JwtTokenPayload>(value)

    if (!decoded?.userId) {
      throw new UnauthorizedError('invalid token')
    }

    return User.create(
      {
        email: decoded.email,
        password: '',
      },
      decoded.userId
    )
  }
}
