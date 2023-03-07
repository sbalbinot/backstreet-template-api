import { ObjectId } from 'mongodb'

export const MongoMapper = {
  map (data: any): any {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  },

  parseToObjectId (id: string): ObjectId {
    return new ObjectId(id)
  }
}
