import { makeAuthentication } from '@/main/factories/domain/use-cases'
import { Controller, SignInController } from '@/application/controllers'
import { makeMongoLogErrorController } from '@/main/factories/application/decorators'
import { makeValidatorHandler } from '@/main/factories/infra/gateways'

export const makeSignInController = (): Controller => {
  const controller = new SignInController(makeAuthentication(), makeValidatorHandler())
  return makeMongoLogErrorController(controller)
}
