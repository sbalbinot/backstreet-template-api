import { env } from '@/main/config/env'
import { BcryptHandler } from '@/infra/gateways'

export const makeBcryptHandler = (): BcryptHandler => {
  return new BcryptHandler(env.salt as number)
}
