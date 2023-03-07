import { MongoConnection } from '@/infra/repos/mongodb/helpers'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const makeFakeDb = async (): Promise<MongoMemoryServer> => {
  const db = await MongoMemoryServer.create()
  const uri = db.getUri()
  await MongoConnection.getInstance().connect(uri)
  return db
}
