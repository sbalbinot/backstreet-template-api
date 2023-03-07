import { Controller, SignUpController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { CompareFields, Email, EmailValidator, RequiredString } from '@/application/validation'
import { EmailInUseError } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'

describe('SignUpController', () => {
  let sut: SignUpController
  let registration: jest.Mock
  let validation: MockProxy<EmailValidator>
  let name: string
  let email: string
  let password: string
  let passwordConfirmation: string

  beforeAll(() => {
    name = 'any_name'
    email = 'any_email'
    password = 'any_password'
    passwordConfirmation = 'any_password'
    validation = mock()
    validation.isEmail.mockReturnValue(true)
    registration = jest.fn()
    registration.mockResolvedValue(undefined)
  })

  beforeEach(() => {
    sut = new SignUpController(registration, validation)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ name, email, password, passwordConfirmation })

    expect(validators).toEqual([
      new RequiredString('any_name', 'name'),
      new RequiredString('any_email', 'email'),
      new Email(validation, 'any_email', 'email'),
      new RequiredString('any_password', 'password'),
      new RequiredString('any_password', 'passwordConfirmation'),
      new CompareFields('any_password', 'any_password', 'passwordConfirmation')
    ])
  })

  it('should call Registration with correct input', async () => {
    await sut.handle({ name, email, password, passwordConfirmation })

    expect(registration).toHaveBeenCalledWith({ name, email, password })
    expect(registration).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication returns EmailInUseError', async () => {
    registration.mockRejectedValueOnce(new EmailInUseError())

    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    registration.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('should return 204 if registration succeeds', async () => {
    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})
