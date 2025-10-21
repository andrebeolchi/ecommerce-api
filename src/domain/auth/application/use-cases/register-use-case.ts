import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'
import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { Logger } from '~/infra/logger'

interface RegisterInput {
  email: string
  password: string
}

interface RegisterDependencies {
  logger: Logger
  userRepository: UserRepository
  passwordHasher: PasswordHasher
}

export const registerUseCase = async (
  input: RegisterInput,
  { logger, userRepository, passwordHasher }: RegisterDependencies
) => {
  try {
    logger.info('registering new user', { email: input.email })

    const existingUser = await userRepository.findByEmail(input.email)

    if (existingUser) {
      logger.warn('user already exists', { email: input.email })
      throw new Error('user already exists')
    }

    const hashedPassword = await passwordHasher.hash(input.password)

    const user = await userRepository.create({
      id: crypto.randomUUID(),
      email: input.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    logger.info('user registered successfully', { userId: user.id })
  } catch (error) {
    logger.error('error registering user', { error })
    throw error
  }
}
