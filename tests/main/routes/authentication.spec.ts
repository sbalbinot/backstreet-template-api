import { app } from '@/main/config/app'
import { ForbiddenError, UnauthorizedError } from '@/application/errors'
import { MongoConnection } from '@/infra/repos/mongodb/helpers'
import { makeFakeDb } from '@/tests/infra/repos/mongodb/mocks'

import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Authentication Routes', () => {
  let db: MongoMemoryServer
  let connection: MongoConnection
  const checkSpy = jest.fn()
  const loadSpy = jest.fn()
  const saveSpy = jest.fn()
  const hashSpy = jest.fn()
  const compareSpy = jest.fn()

  jest.mock('@/infra/repos/mongodb/user-account', () => ({
    MongoUserAccountRepository: jest.fn().mockReturnValue({
      load: loadSpy,
      check: checkSpy,
      save: saveSpy
    })
  }))

  jest.mock('@/infra/gateways/bcrypt-handler', () => ({
    BcryptHandler: jest.fn().mockReturnValue({
      hash: hashSpy,
      compare: compareSpy
    })
  }))

  beforeAll(async () => {
    db = await makeFakeDb()
    connection = MongoConnection.getInstance()
  })

  afterAll(async () => {
    await connection.disconnect()
    await db.stop()
  })

  beforeEach(async () => {
    await connection.getCollection('users').deleteMany({})
  })

  describe('POST /signup', () => {
    it('should return 204', async () => {
      checkSpy.mockResolvedValueOnce(false)
      hashSpy.mockResolvedValueOnce('any_hashed_password')
      saveSpy.mockResolvedValueOnce('any_id')

      const { status, body } = await request(app)
        .post('/api/signup')
        .send({ name: 'any_name', email: 'any_email@mail.com', password: 'any_password', passwordConfirmation: 'any_password' })

      expect(status).toBe(204)
      expect(body).toEqual({})
    })

    it('should return 401 with UnauthorizedError', async () => {
      checkSpy.mockResolvedValueOnce(true)

      const { status, body } = await request(app)
        .post('/api/signup')
        .send({ name: 'any_name', email: 'any_email@mail.com', password: 'any_password', passwordConfirmation: 'any_password' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })

  describe('POST /signin', () => {
    it('should return 200 with valid data', async () => {
      loadSpy.mockResolvedValueOnce({ id: 'any_id', name: 'any_name', email: 'any_email@mail.com', password: 'any_password' })
      compareSpy.mockResolvedValueOnce(true)

      const { status, body } = await request(app)
        .post('/api/signin')
        .send({ email: 'any_email@mail.com', password: 'any_password' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
      expect(body.name).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/signin')
        .send({ email: 'any_email@mail.com', password: 'any_password' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })

    it('should return 403 with ForbiddenError', async () => {
      loadSpy.mockResolvedValueOnce({ id: 'any_id', name: 'any_name', email: 'any_email@mail.com', password: 'any_password' })

      const { status, body } = await request(app)
        .post('/api/signin')
        .send({ email: 'any_email@mail.com', password: 'wrong_password' })

      expect(status).toBe(403)
      expect(body.error).toBe(new ForbiddenError().message)
    })
  })
})
