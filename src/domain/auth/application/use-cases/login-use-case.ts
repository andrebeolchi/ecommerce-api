import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'
import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { Logger } from '~/infra/logger'

interface LoginInput {
  email: string
  password: string
}

export class LoginUseCase {
  constructor(
    private logger: Logger,
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private jwtProvider: JwtProvider
  ) {}

  async execute(input: LoginInput) {
    try {
      this.logger.info('logging in user', { email: input.email })

      const user = await this.userRepository.findByEmail(input.email)

      if (!user) {
        this.logger.warn('user not found', { email: input.email })
        throw new Error('invalid credentials')
      }

      const isPasswordValid = await this.passwordHasher.compare(input.password, user.password)

      if (!isPasswordValid) {
        this.logger.warn('invalid password attempt', { email: input.email })
        throw new Error('invalid credentials')
      }

      const token = this.jwtProvider.generateToken({ userId: user.id, email: user.email })

      this.logger.info('user logged in successfully', { userId: user.id })

      return { token }
    } catch (error) {
      this.logger.error('error logging in user', { error })
      throw error
    }
  }
}
