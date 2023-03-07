import { MongoLogErrorRepository } from '@/infra/repos/mongodb'
import { MongoConnection } from '@/infra/repos/mongodb/helpers'
import { makeFakeDb } from '@/tests/infra/repos/mongodb/mocks'

import { Collection } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('MongoLogErrorRepository', () => {
  let sut: MongoLogErrorRepository
  let db: MongoMemoryServer
  let connection: MongoConnection
  let errorCollection: Collection

  beforeAll(async () => {
    db = await makeFakeDb()
    connection = MongoConnection.getInstance()
    errorCollection = connection.getCollection('errors')
  })

  afterAll(async () => {
    await connection.disconnect()
    await db.stop()
  })

  beforeEach(async () => {
    await errorCollection.deleteMany({})
    sut = new MongoLogErrorRepository()
  })

  it('Should create an error log on success', async () => {
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
