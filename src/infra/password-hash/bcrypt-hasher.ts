import bcrypt from 'bcryptjs'

import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'

export class BcryptHasher implements PasswordHasher {
  private readonly saltRounds = 10

  async hash(raw: string): Promise<string> {
    return bcrypt.hash(raw, this.saltRounds)
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed)
  }
}
