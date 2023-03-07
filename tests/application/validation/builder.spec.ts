import { CompareFields, Required, RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any' } })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'any' })])
  })

  it('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })

  it('should return CompareFields', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .compare({ compareFrom: 'another_value' })
      .build()

    expect(validators).toEqual([new CompareFields('any_value', 'another_value')])
  })
})
