import { Authentication, setupAuthentication } from '@/domain/use-cases'
import { LoadUserAccount } from '@/domain/contracts/repos'
import { TokenGenerator, HashComparer } from '@/domain/contracts/gateways'
import { AccessToken, UserNotFoundError, WrongPasswordError } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Authentication', () => {
  let userAccountRepo: MockProxy<LoadUserAccount>
  let token: MockProxy<TokenGenerator>
  let hash: MockProxy<HashComparer>
  let email: string
  let password: string
  let sut: Authentication

  beforeAll(() => {
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue({
      id: 'any_user_id',
      name: 'any_user_name',
      password: 'any_user_password'
    })
    hash = mock()
    hash.compare.mockResolvedValue(true)
    token = mock()
    token.generate.mockResolvedValue('any_generated_token')
    email = 'any_email'
    password = 'any_password'
  })

  beforeEach(() => {
    sut = setupAuthentication(
      userAccountRepo,
      token,
      hash
    )
  })

  it('should call LoadUserAccount with correct input', async () => {
    await sut({ email, password })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should throw UserNotFoundError when LoadUserAccount returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new UserNotFoundError())
  })

  it('should call HashComparer with correct input', async () => {
    await sut({ email, password })

    expect(hash.compare).toHaveBeenCalledWith({ plainText: password, digest: 'any_user_password' })
    expect(hash.compare).toHaveBeenCalledTimes(1)
  })

  it('should throw WrongPasswordError if HashComparer returns false', async () => {
    hash.compare.mockResolvedValueOnce(false)

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new WrongPasswordError())
  })

  it('should call TokenGenerator with correct input', async () => {
    await sut({ email, password })

    expect(token.generate).toHaveBeenCalledWith({ key: 'any_user_id', expirationInMs: AccessToken.expirationInMs })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  it('should return correct data on success', async () => {
    const result = await sut({ email, password })

    expect(result).toEqual({ accessToken: 'any_generated_token', name: 'any_user_name' })
  })

  it('should rethrow if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if HashComparer throws', async () => {
    hash.compare.mockRejectedValueOnce(new Error('compare_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('compare_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    token.generate.mockRejectedValueOnce(new Error('generate_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('generate_error'))
  })
})
