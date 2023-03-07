import { LoadUserAccount } from '@/domain/contracts/repos'
import { TokenGenerator, HashComparer } from '@/domain/contracts/gateways'
import { AccessToken, UserNotFoundError, WrongPasswordError } from '@/domain/entities'

type Setup = (userAccountRepo: LoadUserAccount, token: TokenGenerator, hash: HashComparer) => Authentication
type Input = { email: string, password: string }
type Output = { accessToken: string, name: string }
export type Authentication = (input: Input) => Promise<Output>

export const setupAuthentication: Setup = (userAccountRepo, token, hash) => async input => {
  const { email, password } = input
  const account = await userAccountRepo.load({ email })
  if (account === undefined) throw new UserNotFoundError()
  const matches = await hash.compare({ plainText: password, digest: account.password })
  if (!matches) throw new WrongPasswordError()
  const accessToken = await token.generate({ key: account.id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken, name: account.name }
}
