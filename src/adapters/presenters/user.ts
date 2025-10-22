import { User } from '~/domain/auth/entities/user'

export class UserPresenter {
  static toJSON(user: User) {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
