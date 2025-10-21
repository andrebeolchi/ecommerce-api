import { User } from '~/domain/auth/entities/user'

import { UserRepository } from '~/domain/auth/application/repositories/user-repository'

export const create = async (_: User) => ({}) as User
export const findByEmail = async (_: string) => null as User | null

export const mockUserRepository: UserRepository = {
  create,
  findByEmail,
}
