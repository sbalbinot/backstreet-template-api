import { ConnectionNotFoundError, MongoConnection, TransactionNotFoundError } from '@/infra/repos/mongodb/helpers'
import { MongoClient } from 'mongodb'

jest.mock('mongodb')

describe('MongoConnection', () => {
  let connectSpy: jest.Mock
  let closeSpy: jest.Mock
  let startSessionSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let endSessionSpy: jest.Mock
  let commitTransactionSpy: jest.Mock
  let abortTransactionSpy: jest.Mock
  let dbSpy: jest.Mock
  let collectionSpy: jest.Mock
  let uri: string
  let sut: MongoConnection

  beforeAll(() => {
    uri = process.env.MONGO_URL as string
    startTransactionSpy = jest.fn()
    commitTransactionSpy = jest.fn()
    abortTransactionSpy = jest.fn()
    endSessionSpy = jest.fn()
    startSessionSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      commitTransaction: commitTransactionSpy,
      abortTransaction: abortTransactionSpy,
      endSession: endSessionSpy
    })
    collectionSpy = jest.fn().mockReturnValue('any_collection')
    dbSpy = jest.fn().mockReturnValue({
      collection: collectionSpy
    })
    closeSpy = jest.fn()
    connectSpy = jest.fn().mockReturnValue({
      startSession: startSessionSpy,
      db: dbSpy,
      close: closeSpy
    })
    jest.mocked(MongoClient.connect).mockImplementation(connectSpy)
  })

  beforeEach(() => {
    sut = MongoConnection.getInstance()
  })

  it('should have only one instance', () => {
    const sut2 = MongoConnection.getInstance()

    expect(sut).toBe(sut2)
  })

  it('should create a new connection', async () => {
    await sut.connect(uri)

    expect(connectSpy).toHaveBeenCalledWith(uri)
    expect(connectSpy).toHaveBeenCalledTimes(1)
  })

  it('should use an existing connection', async () => {
    await sut.connect(uri)
    await sut.connect(uri)

    expect(connectSpy).toHaveBeenCalledWith(uri)
    expect(connectSpy).toHaveBeenCalledTimes(2)
  })

  it('should close connection', async () => {
    await sut.connect(uri)
    await sut.disconnect()

    expect(closeSpy).toHaveBeenCalledWith()
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('should return ConnectionNotFoundError on disconnect if connection is not found', async () => {
    const promise = sut.disconnect()

    expect(closeSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should open transaction', async () => {
    await sut.connect(uri)
    await sut.openTransaction()

    expect(startSessionSpy).toHaveBeenCalledWith()
    expect(startSessionSpy).toHaveBeenCalledTimes(1)
    expect(startTransactionSpy).toHaveBeenCalledWith()
    expect(startTransactionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('should return ConnectionNotFoundError on openTransaction if connection is not found', async () => {
    const promise = sut.openTransaction()

    expect(startTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should close transaction', async () => {
    await sut.connect(uri)
    await sut.openTransaction()
    await sut.closeTransaction()

    expect(endSessionSpy).toHaveBeenCalledWith()
    expect(endSessionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('should return TransactionNotFoundError on closeTransaction if session is not found', async () => {
    const promise = sut.closeTransaction()

    expect(endSessionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new TransactionNotFoundError())
  })

  it('should commit transaction', async () => {
    await sut.connect(uri)
    await sut.openTransaction()
    await sut.commit()

    expect(commitTransactionSpy).toHaveBeenCalledWith()
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('should return TransactionNotFoundError on commit if session is not found', async () => {
    const promise = sut.commit()

    expect(commitTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new TransactionNotFoundError())
  })

  it('should rollback transaction', async () => {
    await sut.connect(uri)
    await sut.openTransaction()
    await sut.rollback()

    expect(abortTransactionSpy).toHaveBeenCalledWith()
    expect(abortTransactionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('should return TransactionNotFoundError on rollback if session is not found', async () => {
    const promise = sut.rollback()

    expect(abortTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new TransactionNotFoundError())
  })

  it('should get collection', async () => {
    await sut.connect(uri)
    const collection = sut.getCollection('users')

    expect(dbSpy).toHaveBeenCalledWith()
    expect(dbSpy).toHaveBeenCalledTimes(1)
    expect(collectionSpy).toHaveBeenCalledWith('users')
    expect(collectionSpy).toHaveBeenCalledTimes(1)
    expect(collection).toBe('any_collection')

    await sut.disconnect()
  })

  it('should return ConnectionNotFoundError on getCollection if connection is not found', async () => {
    expect(collectionSpy).not.toHaveBeenCalled()
    expect(() => sut.getCollection('users')).toThrow(new ConnectionNotFoundError())
  })
})
