import { faker } from '@faker-js/faker'
import { Request, Response } from 'express'
import request from 'supertest'

import { app } from '../config/app'

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    const uriTest = '/test'
    const fakeBody = { word: faker.random.word() }

    app.post(uriTest, (request: Request, response: Response) => {
      response.send(request.body)
    })

    await request(app).post(uriTest).send(fakeBody).expect(fakeBody)
  })
})
