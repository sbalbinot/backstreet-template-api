import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeSignInController, makeSignUpController } from '@/main/factories/application/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adapt(makeSignUpController()))
  router.post('/signin', adapt(makeSignInController()))
}
