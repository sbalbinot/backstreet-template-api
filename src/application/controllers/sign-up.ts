import { Controller } from '@/application/controllers'
import { HttpResponse, unauthorized, noContent } from '@/application/helpers'
import { ValidationBuilder, EmailValidator, Validator } from '@/application/validation'
import { Registration } from '@/domain/use-cases'
import { EmailInUseError } from '@/domain/entities'

type HttpRequest = { name: string, email: string, password: string, passwordConfirmation: string }
type Model = undefined | Error

export class SignUpController extends Controller {
  constructor (
    private readonly registration: Registration,
    private readonly validation: EmailValidator
  ) {
    super()
  }

  async perform ({ name, email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      await this.registration({ name, email, password })
      return noContent()
    } catch (error: unknown) {
      if (error instanceof EmailInUseError) return unauthorized()
      throw error
    }
  }

  override buildValidators ({ name, email, password, passwordConfirmation }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ value: email, fieldName: 'email' }).required().email({ validation: this.validation }).build(),
      ...ValidationBuilder.of({ value: password, fieldName: 'password' }).required().build(),
      ...ValidationBuilder.of({ value: passwordConfirmation, fieldName: 'passwordConfirmation' }).required().compare({ compareFrom: password }).build()
    ]
  }
}
