import { faker } from '@faker-js/faker'
import request from 'supertest'

import { app } from '../config/app'

describe('SignUp Route', () => {
  it('Should return an account on success', async () => {
    const rut = '/api/sign-up'

    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const requestData = { name, email, password, passwordConfirmation: password }

    await request(app)
      .post(rut)
      .send(requestData)
      .expect(200)
  })
})
