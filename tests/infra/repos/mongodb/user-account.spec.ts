import { MongoUserAccountRepository } from '@/infra/repos/mongodb'
import { MongoConnection } from '@/infra/repos/mongodb/helpers'
import { makeFakeDb } from '@/tests/infra/repos/mongodb/mocks'

import { Collection, ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('MongoUserAccountRepository', () => {
  let sut: MongoUserAccountRepository
  let db: MongoMemoryServer
  let connection: MongoConnection
  let userCollection: Collection

  beforeAll(async () => {
    db = await makeFakeDb()
    connection = MongoConnection.getInstance()
    userCollection = connection.getCollection('users')
  })

  afterAll(async () => {
    await connection.disconnect()
    await db.stop()
  })

  beforeEach(async () => {
    await userCollection.deleteMany({})
    sut = new MongoUserAccountRepository()
  })

  describe('load()', () => {
    it('should return an account if email exists', async () => {
      await userCollection.insertOne({ name: 'any_name', email: 'any_email', password: 'any_password' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('check()', () => {
    it('should return true if email exists', async () => {
      await userCollection.insertOne({ name: 'any_name', email: 'any_email', password: 'any_password' })

      const result = await sut.check({ email: 'any_email' })

      expect(result).toBe(true)
    })

    it('should return false if email does not exists', async () => {
      const result = await sut.check({ email: 'any_email' })

      expect(result).toBe(false)
    })
  })

  describe('save()', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.save({ name: 'any_name', email: 'any_email', password: 'any_password' })
      const objectId = new ObjectId(id)
      const user = await userCollection.findOne({ _id: objectId })

      expect(id).toBeTruthy()
      expect(user).toMatchObject({
        _id: objectId,
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
    })

    it('should update an account if id is defined', async () => {
      const { insertedId } = await userCollection.insertOne({ name: 'any_name', email: 'any_email', password: 'any_password' })

      await sut.save({ id: insertedId.toString(), name: 'new_name', email: 'new_email', password: 'new_password' })
      const user = await userCollection.findOne({ _id: insertedId })

      expect(user).toMatchObject({
        _id: insertedId,
        name: 'new_name',
        email: 'new_email',
        password: 'new_password'
      })
    })
  })
})
