import { CheckUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { Hasher } from '@/domain/contracts/gateways'
import { EmailInUseError } from '@/domain/entities'

type Setup = (userAccountRepo: CheckUserAccount & SaveUserAccount, hash: Hasher) => Registration
type Input = { name: string, email: string, password: string }
export type Registration = (input: Input) => Promise<void>

export const setupRegistration: Setup = (userAccountRepo, hash) => async input => {
  const { name, email, password } = input
  const accountExists = await userAccountRepo.check({ email })
  if (accountExists) throw new EmailInUseError()
  const hashedPassword = await hash.hash({ plainText: password })
  await userAccountRepo.save({
    name,
    email,
    password: hashedPassword
  })
}
