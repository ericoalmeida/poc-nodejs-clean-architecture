import { faker } from '@faker-js/faker'

import { SignUpController } from './sign-up.controller'

describe('SignUpController', () => {
  describe('#handle', () => {
    it('should return 400 if no name is provided', async () => {
      const sut = new SignUpController()

      const fakeEmail = faker.internet.email
      const fakePassword = faker.internet.password

      const httpRequest = {
        body: {
          email: fakeEmail,
          password: fakePassword,
          passwordConfirmation: fakePassword
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      const expectedStatusCode = 400
      const expectedError = new Error('Missing param: name')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })

    it('should return 400 if no email is provided', async () => {
      const sut = new SignUpController()

      const fakeName = faker.name.firstName
      const fakePassword = faker.internet.password

      const httpRequest = {
        body: {
          name: fakeName,
          password: fakePassword,
          passwordConfirmation: fakePassword
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      const expectedStatusCode = 400
      const expectedError = new Error('Missing param: email')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })
  })
})
