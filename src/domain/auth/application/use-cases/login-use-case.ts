import { JwtProvider } from '~/domain/auth/application/repositories/jwt-provider'
import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { Logger } from '~/infra/logger'

interface LoginInput {
  email: string
  password: string
}

interface LoginDependencies {
  logger: Logger
  userRepository: UserRepository
  passwordHasher: PasswordHasher
  jwtProvider: JwtProvider
}

export const loginUseCase = async (
  input: LoginInput,
  { logger, userRepository, passwordHasher, jwtProvider }: LoginDependencies
) => {
  try {
    logger.info('logging in user', { email: input.email })

    const user = await userRepository.findByEmail(input.email)

    if (!user) {
      logger.warn('user not found', { email: input.email })
      throw new Error('invalid credentials')
    }

    const isPasswordValid = await passwordHasher.compare(input.password, user.password)

    if (!isPasswordValid) {
      logger.warn('invalid password attempt', { email: input.email })
      throw new Error('invalid credentials')
    }

    const token = jwtProvider.generateToken({ userId: user.id, email: user.email })

    logger.info('user logged in successfully', { userId: user.id })

    return { token }
  } catch (error) {
    logger.error('error logging in user', { error })
    throw error
  }
}
