import { InvalidFieldError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class CompareFields implements Validator {
  constructor (
    readonly value: any,
    readonly valueToCompareFrom: any,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    if (this.value !== this.valueToCompareFrom) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}
