import { Controller } from '@/application/controllers'
import { LogErrorController } from '@/application/decorators'
import { ServerError } from '@/application/errors'
import { LogErrorRepository } from '@/application/contracts'

import { mock, MockProxy } from 'jest-mock-extended'

describe('LogErrorController', () => {
  let repo: MockProxy<LogErrorRepository>
  let decoratee: MockProxy<Controller>
  let sut: LogErrorController

  beforeAll(() => {
    repo = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({
      statusCode: 204,
      data: null
    })
  })

  beforeEach(() => {
    sut = new LogErrorController(decoratee, repo)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })

  it('should call logError with correct error if decoratee returns a server error', async () => {
    const error = new ServerError(new Error('decoratee_error'))
    error.stack = 'decoratee_stack'
    decoratee.perform.mockRejectedValueOnce(error)

    sut.perform({ any: 'any' }).catch(() => {
      expect(repo.logError).toHaveBeenCalledWith(error.stack)
      expect(repo.logError).toHaveBeenCalledTimes(1)
    })
  })

  it('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })

    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })

  it('should rethrow if decoratee throws', async () => {
    const error = new Error('decoratee_error')
    decoratee.perform.mockRejectedValueOnce(error)

    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(error)
  })
})
