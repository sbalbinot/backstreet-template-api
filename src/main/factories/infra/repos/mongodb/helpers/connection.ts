import { MongoConnection } from '@/infra/repos/mongodb/helpers'

export const makeMongoConnection = (): MongoConnection => {
  return MongoConnection.getInstance()
}
