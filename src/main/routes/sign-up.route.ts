/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/express-route.adapter'
import { signUpFactory } from '../factories/sign-up.factory'

export default (router: Router): void => {
  router.post('/sign-up', expressRouteAdapter(signUpFactory()))
}
