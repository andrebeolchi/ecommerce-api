import { UnauthorizedError } from '~/domain/commons/errors/unauthorized'
import { ValidationError } from '~/domain/commons/errors/validation'

import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { Logger } from '~/infra/logger'

export class RefreshTokenUseCase {
  constructor(
    private logger: Logger,
    private jwtProvider: JwtProvider,
    private userRepository: UserRepository
  ) {}

  async execute(token?: string) {
    try {
      if (!token || !token.startsWith('Bearer ')) {
        throw new ValidationError('invalid token format')
      }

      const [, value] = token.split(' ')

      const decoded = await this.jwtProvider.verifyToken(value)

      if (!decoded?.userId) {
        throw new UnauthorizedError('invalid token')
      }

      const user = await this.userRepository.findByEmail(decoded.email)

      if (!user) {
        throw new UnauthorizedError('user does not exist')
      }

      const newToken = await this.jwtProvider.generateToken({ userId: user.id, email: user.email })

      this.logger.info('refresh token generated successfully', { userId: user.id })

      return { token: newToken, userId: user.id, email: user.email }
    } catch (error) {
      this.logger.error('error refreshing token', { error })
      throw error
    }
  }
}
