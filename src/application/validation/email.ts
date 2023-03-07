import { InvalidFieldError } from '@/application/errors'
import { Validator, EmailValidator } from '@/application/validation'

export class Email implements Validator {
  constructor (
    private readonly validation: EmailValidator,
    readonly value: any,
    readonly fieldName?: string
  ) {}

  validate (): Error | undefined {
    if (!this.validation.isEmail({ email: this.value })) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}
