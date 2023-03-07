import { CheckUserAccount, LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { MongoConnection, MongoMapper } from '@/infra/repos/mongodb/helpers'

export class MongoUserAccountRepository implements CheckUserAccount, LoadUserAccount, SaveUserAccount {
  private readonly collectionName = 'users'
  private readonly connection = MongoConnection.getInstance()

  async check ({ email }: CheckUserAccount.Input): Promise<CheckUserAccount.Output> {
    const collection = this.connection.getCollection(this.collectionName)
    const user = await collection.findOne({
      email
    }, {
      projection: {
        _id: 1
      }
    })
    return user !== null
  }

  async load ({ email }: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const collection = this.connection.getCollection(this.collectionName)
    const user = await collection.findOne({ email })
    if (user !== null) return MongoMapper.map(user)
  }

  async save ({ id, name, email, password }: SaveUserAccount.Input): Promise<SaveUserAccount.Output> {
    const collection = this.connection.getCollection(this.collectionName)
    let resultId: string
    if (id === undefined) {
      const user = await collection.insertOne({ name, email, password })
      resultId = user.insertedId.toString()
    } else {
      resultId = id
      await collection.updateOne({
        _id: MongoMapper.parseToObjectId(id)
      }, {
        $set: { name, email, password }
      })
    }
    return { id: resultId }
  }
}
