import { Controller } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'
import { LogErrorRepository } from '@/application/contracts'
import { Validator } from '@/application/validation'

export class LogErrorController extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly repo: LogErrorRepository
  ) {
    super()
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)
      return httpResponse
    } catch (error: unknown) {
      if (error instanceof ServerError && error.stack !== undefined) {
        await this.repo.logError(error.stack)
      }
      throw error
    }
  }

  override buildValidators (httpRequest: any): Validator[] {
    return this.decoratee.buildValidators(httpRequest)
  }
}
