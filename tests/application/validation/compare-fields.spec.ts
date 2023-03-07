import { InvalidFieldError } from '@/application/errors'
import { CompareFields } from '@/application/validation'

describe('CompareFields', () => {
  it('should return InvalidFieldError if values are not equal', () => {
    const sut = new CompareFields('any_value', 'another_value', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('any_field'))
  })

  it('should return undefined if values are equal', () => {
    const sut = new CompareFields('any_value', 'any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
