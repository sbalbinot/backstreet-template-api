import { HashComparer, Hasher } from '@/domain/contracts/gateways'

import bcrypt from 'bcrypt'

export class BcryptHandler implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash ({ plainText }: Hasher.Input): Promise<Hasher.Output> {
    return bcrypt.hash(plainText, this.salt)
  }

  async compare ({ plainText, digest }: HashComparer.Input): Promise<HashComparer.Output> {
    return await bcrypt.compare(plainText, digest)
  }
}
