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

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
    })
  })
})
