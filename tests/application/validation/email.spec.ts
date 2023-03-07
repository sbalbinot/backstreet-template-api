import { InvalidFieldError } from '@/application/errors'
import { Email, EmailValidator } from '@/application/validation'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Email', () => {
  let sut: Email
  let validator: MockProxy<EmailValidator>

  beforeAll(() => {
    validator = mock()
    validator.isEmail.mockReturnValue(true)
  })

  beforeEach(() => {
    sut = new Email(validator, 'any_email@mail.com', 'email')
  })

  it('should return InvalidFieldError if email is invalid', () => {
    validator.isEmail.mockReturnValueOnce(false)

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('email'))
  })

  it('should return undefined if email is valid', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
