import { BcryptHandler } from '@/infra/gateways'

import bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('BcryptHandler', () => {
  let sut: BcryptHandler
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let salt: number

  beforeAll(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    salt = 12
  })

  beforeEach(() => {
    sut = new BcryptHandler(salt)
  })

  describe('hash()', () => {
    let plainText: string

    beforeAll(() => {
      plainText = 'any_plain_text'
      fakeBcrypt.hash.mockImplementation(() => 'any_hashed_value')
      fakeBcrypt.compare.mockImplementation(() => true)
    })

    it('should call hash with correct input', async () => {
      await sut.hash({ plainText })

      expect(fakeBcrypt.hash).toHaveBeenCalledWith(plainText, salt)
      expect(fakeBcrypt.hash).toHaveBeenCalledTimes(1)
    })

    it('should return a valid hash on success', async () => {
      const result = await sut.hash({ plainText })

      expect(result).toBe('any_hashed_value')
    })

    it('should rethrow if hash throws', async () => {
      fakeBcrypt.hash.mockImplementationOnce(() => { throw new Error('hash_error') })

      const promise = sut.hash({ plainText })

      await expect(promise).rejects.toThrow(new Error('hash_error'))
    })
  })

  describe('compare()', () => {
    let plainText: string
    let digest: string

    beforeAll(() => {
      plainText = 'any_plain_text'
      digest = 'any_digest'
      fakeBcrypt.compare.mockImplementation(() => true)
    })

    it('should call compare with correct input', async () => {
      await sut.compare({ plainText, digest })

      expect(fakeBcrypt.compare).toHaveBeenCalledWith(plainText, digest)
      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
    })

    it('should return true on success', async () => {
      const result = await sut.compare({ plainText, digest })

      expect(result).toBe(true)
    })

    it('should return false on failure', async () => {
      fakeBcrypt.compare.mockImplementation(() => false)

      const result = await sut.compare({ plainText, digest })

      expect(result).toBe(false)
    })

    it('should rethrow if compare throws', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => { throw new Error('compare_error') })

      const promise = sut.compare({ plainText, digest })

      await expect(promise).rejects.toThrow(new Error('compare_error'))
    })
  })
})
