import { User } from '~/domain/auth/entities/user'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
}
