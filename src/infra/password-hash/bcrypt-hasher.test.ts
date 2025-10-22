import { BcryptHasher } from './bcrypt-hasher'

const hasher = new BcryptHasher()

describe('[infra] bcrypt hasher', () => {
  describe('hash', () => {
    it('should hash a string and return a hashed value', async () => {
      const raw = 'my-secret-password'
      const hashed = await hasher.hash(raw)

      expect(hashed).not.toBe(raw)
      expect(typeof hashed).toBe('string')
      expect(hashed.length).toBeGreaterThan(0)
    })
  })

  describe('compare', () => {
    it('should return true when comparing raw string with correct hash', async () => {
      const raw = 'my-secret-password'
      const hashed = await hasher.hash(raw)

      const isValid = await hasher.compare(raw, hashed)
      expect(isValid).toBe(true)
    })

    it('should return false when comparing raw string with wrong hash', async () => {
      const raw = 'my-secret-password'
      const hashed = await hasher.hash(raw)

      const isValid = await hasher.compare('wrong-password', hashed)
      expect(isValid).toBe(false)
    })
  })
})
