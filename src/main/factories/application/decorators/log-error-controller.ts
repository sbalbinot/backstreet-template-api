import { Controller } from '@/application/controllers'
import { LogErrorController } from '@/application/decorators'
import { makeMongoLogErrorRepo } from '@/main/factories/infra/repos/mongodb'

export const makeMongoLogErrorController = (controller: Controller): Controller => {
  return new LogErrorController(controller, makeMongoLogErrorRepo())
}
