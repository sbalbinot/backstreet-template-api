export class RequiredFieldError extends Error {
  constructor (fieldName?: string) {
    const message = fieldName === undefined
      ? 'Field required'
      : `The field ${fieldName} is required`
    super(message)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidFieldError extends Error {
  constructor (fieldName?: string) {
    const message = fieldName === undefined
      ? 'Invalid field'
      : `Invalid field: ${fieldName}`
    super(message)
    this.name = 'InvalidFieldError'
  }
}
