import { MongoLogErrorRepository } from '@/infra/repos/mongodb'

export const makeMongoLogErrorRepo = (): MongoLogErrorRepository => {
  return new MongoLogErrorRepository()
}
