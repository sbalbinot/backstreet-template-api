import { MongoUserAccountRepository } from '@/infra/repos/mongodb'

export const makeMongoUserAccountRepo = (): MongoUserAccountRepository => {
  return new MongoUserAccountRepository()
}
