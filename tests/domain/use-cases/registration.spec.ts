import { Registration, setupRegistration } from '@/domain/use-cases'
import { CheckUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { Hasher } from '@/domain/contracts/gateways'
import { EmailInUseError } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Registration', () => {
  let userAccountRepo: MockProxy<CheckUserAccount & SaveUserAccount>
  let hash: MockProxy<Hasher>
  let name: string
  let email: string
  let password: string
  let sut: Registration

  beforeAll(() => {
    userAccountRepo = mock()
    userAccountRepo.check.mockResolvedValue(false)
    userAccountRepo.save.mockResolvedValue({ id: 'any_id' })
    hash = mock()
    hash.hash.mockResolvedValue('any_hashed_password')
    name = 'any_name'
    email = 'any_email'
    password = 'any_password'
  })

  beforeEach(() => {
    sut = setupRegistration(
      userAccountRepo,
      hash
    )
  })

  it('should call CheckUserAccount with correct input', async () => {
    await sut({ name, email, password })

    expect(userAccountRepo.check).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.check).toHaveBeenCalledTimes(1)
  })

  it('should throw EmailInUseError when CheckUserAccount returns true', async () => {
    userAccountRepo.check.mockResolvedValueOnce(true)

    const promise = sut({ name, email, password })

    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  it('should call Hasher with correct input', async () => {
    await sut({ name, email, password })

    expect(hash.hash).toHaveBeenCalledWith({ plainText: password })
    expect(hash.hash).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserAccount with correct input', async () => {
    await sut({ name, email, password })

    expect(userAccountRepo.save).toHaveBeenCalledWith({ name, email, password: 'any_hashed_password' })
    expect(userAccountRepo.save).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if CheckUserAccount throws', async () => {
    userAccountRepo.check.mockRejectedValueOnce(new Error('check_error'))

    const promise = sut({ name, email, password })

    await expect(promise).rejects.toThrow(new Error('check_error'))
  })

  it('should rethrow if Hasher throws', async () => {
    hash.hash.mockRejectedValueOnce(new Error('hash_error'))

    const promise = sut({ name, email, password })

    await expect(promise).rejects.toThrow(new Error('hash_error'))
  })

  it('should rethrow if SaveUserAccount throws', async () => {
    userAccountRepo.save.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ name, email, password })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
