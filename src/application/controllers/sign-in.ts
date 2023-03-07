import { Controller } from '@/application/controllers'
import { HttpResponse, unauthorized, ok, forbidden } from '@/application/helpers'
import { ValidationBuilder, EmailValidator, Validator } from '@/application/validation'
import { Authentication } from '@/domain/use-cases'
import { UserNotFoundError, WrongPasswordError } from '@/domain/entities'

type HttpRequest = { email: string, password: string }
type Model = Error | { accessToken: string, name: string }

export class SignInController extends Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: EmailValidator
  ) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.authentication({ email, password })
      return ok(accessToken)
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) return unauthorized()
      else if (error instanceof WrongPasswordError) return forbidden()
      throw error
    }
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: email, fieldName: 'email' }).required().email({ validation: this.validation }).build(),
      ...ValidationBuilder.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}
