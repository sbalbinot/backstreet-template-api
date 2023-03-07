import { makeBcryptHandler, makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { makeMongoUserAccountRepo } from '@/main/factories/infra/repos/mongodb'
import { setupAuthentication, Authentication } from '@/domain/use-cases'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(
    makeMongoUserAccountRepo(),
    makeJwtTokenHandler(),
    makeBcryptHandler()
  )
}
