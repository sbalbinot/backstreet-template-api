import { LogErrorRepository } from '@/application/contracts'
import { MongoConnection } from '@/infra/repos/mongodb/helpers'

export class MongoLogErrorRepository implements LogErrorRepository {
  private readonly collectionName = 'errors'
  private readonly connection = MongoConnection.getInstance()

  async logError (stack: string): Promise<void> {
    const errorCollection = this.connection.getCollection(this.collectionName)
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
