import { User as PrismaUser } from '@prisma/client'

import { User } from '~/domain/auth/entities/user'

import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

import { prisma } from '~/infra/database/prisma'

import { Logger } from '~/infra/logger'

const createUserFromDoc = (doc: PrismaUser): User =>
  User.create(
    {
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
    doc.id
  )

export class PrismaAuthRepository implements UserRepository {
  constructor(private logger: Logger) {}

  async findByEmail(email: string): Promise<User | null> {
    const doc = await prisma.user.findUnique({
      where: { email },
    })

    if (!doc) {
      this.logger.info('user not found in database', { email })
      return null
    }

    this.logger.info('user found in database', { email })

    return createUserFromDoc(doc)
  }

  async create(user: User): Promise<User> {
    const doc = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })

    this.logger.info('user created in database', { userId: doc.id })

    return createUserFromDoc(doc)
  }
}
