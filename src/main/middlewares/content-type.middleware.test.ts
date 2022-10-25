import { Request, Response } from 'express'
import request from 'supertest'

import { app } from '../config/app.config'

describe('Content-Type Middleware', () => {
  it('Should return default content-type as json', async () => {
    const uriTest = '/test'

    app.get(uriTest, (request: Request, response: Response) => {
      response.send()
    })

    await request(app)
      .get(uriTest)
      .send()
      .expect('content-type', /json/)
  })

  it('Should return content-type as xml', async () => {
    const uriTest = '/test/xml'

    app.get(uriTest, (request: Request, response: Response) => {
      response.type('xml')
      response.send()
    })

    await request(app)
      .get(uriTest)
      .send()
      .expect('content-type', /xml/)
  })
})
