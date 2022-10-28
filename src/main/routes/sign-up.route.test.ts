import { faker } from '@faker-js/faker'
import request from 'supertest'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import { app } from '../config/app.config'

const COLLECTION_NAME = 'accounts'

describe('SignUp Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    await accountCollection.deleteMany({})
  })

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
