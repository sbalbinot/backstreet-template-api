import { makeRegistration } from '@/main/factories/domain/use-cases'
import { Controller, SignUpController } from '@/application/controllers'
import { makeMongoLogErrorController } from '@/main/factories/application/decorators'
import { makeValidatorHandler } from '@/main/factories/infra/gateways'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeRegistration(), makeValidatorHandler())
  return makeMongoLogErrorController(controller)
}
