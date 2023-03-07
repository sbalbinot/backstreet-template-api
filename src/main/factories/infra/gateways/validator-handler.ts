import { ValidatorHandler } from '@/infra/gateways'

export const makeValidatorHandler = (): ValidatorHandler => {
  return new ValidatorHandler()
}
