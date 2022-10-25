import { Request, Response, Router } from 'express'

export default (router: Router): void => {
  router.post('/sign-up', (_request: Request, response: Response) => {
    return response.json({ ok: true })
  })
}
