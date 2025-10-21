import { PasswordHasher } from '~/domain/auth/application/repositories/password-hasher'

export const hash = async (plainText: string): Promise<string> => `hashed-${plainText}`
export const compare = async (plainText: string, hashedText: string): Promise<boolean> =>
  hashedText === `hashed-${plainText}`

export const mockPasswordHasher: PasswordHasher = {
  hash,
  compare,
}
