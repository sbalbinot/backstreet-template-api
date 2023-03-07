import { InvalidFieldError, RequiredFieldError } from '@/application/errors'

describe('ValidationError', () => {
  it('should return RequiredFieldError default message if field name is undefined', () => {
    const sut = new RequiredFieldError()

    expect(sut.message).toBe('Field required')
  })

  it('should return RequiredFieldError custom message if field name is defined', () => {
    const sut = new RequiredFieldError('any_field')

    expect(sut.message).toBe('The field any_field is required')
  })

  it('should return InvalidFieldError default message if field name is undefined', () => {
    const sut = new InvalidFieldError()

    expect(sut.message).toBe('Invalid field')
  })

  it('should return InvalidFieldError custom message if field name is defined', () => {
    const sut = new InvalidFieldError('any_field')

    expect(sut.message).toBe('Invalid field: any_field')
  })
})
