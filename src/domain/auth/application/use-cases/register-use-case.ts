import { User } from '~/domain/auth/entities/user'

import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { Logger } from '~/infra/logger'

interface RegisterInput {
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(
    private logger: Logger,
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(input: RegisterInput) {
    try {
      this.logger.info('registering new user', { email: input.email })

      const existingUser = await this.userRepository.findByEmail(input.email)

      if (existingUser) {
        this.logger.warn('user already exists', { email: input.email })
        throw new Error('user already exists')
      }

      const hashedPassword = await this.passwordHasher.hash(input.password)

      const user = User.create({
        email: input.email,
        password: hashedPassword,
      })

      const createdUser = await this.userRepository.create(user)

      this.logger.info('user registered successfully', { userId: createdUser.id })
      return createdUser
    } catch (error) {
      this.logger.error('error registering user', { error })
      throw error
    }
  }
}
