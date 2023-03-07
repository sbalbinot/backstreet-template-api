import { Controller, SignInController } from '@/application/controllers'
import { ForbiddenError, ServerError, UnauthorizedError } from '@/application/errors'
import { Email, RequiredString, EmailValidator } from '@/application/validation'
import { UserNotFoundError, WrongPasswordError } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('SignInController', () => {
  let sut: SignInController
  let authentication: jest.Mock
  let validation: MockProxy<EmailValidator>
  let email: string
  let password: string

  beforeAll(() => {
    email = 'any_email'
    password = 'any_password'
    validation = mock()
    validation.isEmail.mockReturnValue(true)
    authentication = jest.fn()
    authentication.mockResolvedValue({ accessToken: 'any_value', name: 'any_name' })
  })

  beforeEach(() => {
    sut = new SignInController(authentication, validation)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredString('any_email', 'email'),
      new Email(validation, 'any_email', 'email'),
      new RequiredString('any_password', 'password')
    ])
  })

  it('should call authentication with correct input', async () => {
    await sut.handle({ email, password })

    expect(authentication).toHaveBeenCalledWith({ email, password })
    expect(authentication).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication returns UserNotFoundError', async () => {
    authentication.mockRejectedValueOnce(new UserNotFoundError())

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 403 if authentication returns WrongPasswordError', async () => {
    authentication.mockRejectedValueOnce(new WrongPasswordError())

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    authentication.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
        name: 'any_name'
      }
    })
  })
})
