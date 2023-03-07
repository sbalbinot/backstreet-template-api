export class EmailInUseError extends Error {
  constructor () {
    super('Received e-mail is already in use')
    this.name = 'EmailInUseError'
  }
}
