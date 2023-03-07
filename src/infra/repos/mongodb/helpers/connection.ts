import { DbTransaction } from '@/application/contracts'
import { ConnectionNotFoundError, TransactionNotFoundError } from '@/infra/repos/mongodb/helpers'

import { Collection, MongoClient, ClientSession } from 'mongodb'

export class MongoConnection implements DbTransaction {
  private static instance?: MongoConnection
  private connection?: MongoClient
  private session?: ClientSession
  private uri?: string

  private constructor () {}

  static getInstance (): MongoConnection {
    if (MongoConnection.instance === undefined) MongoConnection.instance = new MongoConnection()
    return MongoConnection.instance
  }

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.connection = await MongoClient.connect(this.uri)
  }

  async disconnect (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    await this.connection.close()
    this.connection = undefined
    this.session = undefined
  }

  async openTransaction (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    this.session = this.connection.startSession()
    this.session.startTransaction()
  }

  async closeTransaction (): Promise<void> {
    if (this.session === undefined) throw new TransactionNotFoundError()
    await this.session.endSession()
  }

  async commit (): Promise<void> {
    if (this.session === undefined) throw new TransactionNotFoundError()
    await this.session.commitTransaction()
  }

  async rollback (): Promise<void> {
    if (this.session === undefined) throw new TransactionNotFoundError()
    await this.session.abortTransaction()
  }

  getCollection (name: string): Collection {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    return this.connection.db().collection(name)
  }
}
