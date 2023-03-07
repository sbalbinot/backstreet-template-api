import { ValidatorHandler } from '@/infra/gateways'

import validator from 'validator'

jest.mock('validator')

describe('ValidatorHandler', () => {
  let sut: ValidatorHandler
  let fakeValidator: jest.Mocked<typeof validator>

  beforeAll(() => {
    fakeValidator = validator as jest.Mocked<typeof validator>
  })

  beforeEach(() => {
    sut = new ValidatorHandler()
  })

  describe('isEmail()', () => {
    let email: string

    beforeAll(() => {
      email = 'any_email@mail.com'
      fakeValidator.isEmail.mockReturnValue(true)
    })

    it('should call isEmail with correct input', () => {
      sut.isEmail({ email })

      expect(fakeValidator.isEmail).toHaveBeenCalledWith(email)
      expect(fakeValidator.isEmail).toHaveBeenCalledTimes(1)
    })

    it('should return true if email is valid', () => {
      const result = sut.isEmail({ email })

      expect(result).toBe(true)
    })

    it('should return false if email is invalid', () => {
      fakeValidator.isEmail.mockReturnValueOnce(false)

      const result = sut.isEmail({ email })

      expect(result).toBe(false)
    })
  })
})
