import { makeBcryptHandler } from '@/main/factories/infra/gateways'
import { makeMongoUserAccountRepo } from '@/main/factories/infra/repos/mongodb'
import { setupRegistration, Registration } from '@/domain/use-cases'

export const makeRegistration = (): Registration => {
  return setupRegistration(
    makeMongoUserAccountRepo(),
    makeBcryptHandler()
  )
}
