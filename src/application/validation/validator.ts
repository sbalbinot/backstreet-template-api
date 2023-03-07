export interface Validator {
  validate: () => Error | undefined
}

export interface EmailValidator {
  isEmail: (input: EmailValidator.Input) => EmailValidator.Output
}

export namespace EmailValidator {
  export type Input = {
    email: string
  }
  export type Output = boolean
}
