import { EmailValidator } from '@/application/validation'

import validator from 'validator'

export class ValidatorHandler implements EmailValidator {
  isEmail ({ email }: EmailValidator.Input): EmailValidator.Output {
    return validator.isEmail(email)
  }
}
