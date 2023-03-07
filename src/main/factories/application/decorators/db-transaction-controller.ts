import { Controller } from '@/application/controllers'
import { DbTransactionController } from '@/application/decorators'
import { makeMongoConnection } from '@/main/factories/infra/repos/mongodb/helpers'

export const makeMongoTransactionController = (controller: Controller): DbTransactionController => {
  return new DbTransactionController(controller, makeMongoConnection())
}
