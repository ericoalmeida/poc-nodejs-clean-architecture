import { Request, Response } from 'express'
import request from 'supertest'

import { app } from '../config/app.config'

describe('CORS Middleware', () => {
  it('Should enable CORS', async () => {
    const uriTest = '/test'

    app.get(uriTest, (request: Request, response: Response) => {
      response.send()
    })

    await request(app)
      .get(uriTest)
      .send()
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
