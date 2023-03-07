import { CompareFields, Email, Required, RequiredString, EmailValidator, Validator } from '@/application/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ value, fieldName }: { value: any, fieldName?: string }): ValidationBuilder {
    return new ValidationBuilder(value, fieldName)
  }

  required (): ValidationBuilder {
    if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName))
    } else {
      this.validators.push(new Required(this.value, this.fieldName))
    }
    return this
  }

  compare ({ compareFrom }: { compareFrom: string }): ValidationBuilder {
    this.validators.push(new CompareFields(this.value, compareFrom, this.fieldName))
    return this
  }

  email ({ validation }: { validation: EmailValidator }): ValidationBuilder {
    this.validators.push(new Email(validation, this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
