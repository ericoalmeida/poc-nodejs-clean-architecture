import { faker } from '@faker-js/faker'

import { MissingParamError } from '../errors/missing-param.error'
import { ControllerProtocol } from '../protocols/controller.protocol'
import { SignUpController } from './sign-up.controller'

describe('SignUpController', () => {
  describe('#handle', () => {
    const makeSut = (): ControllerProtocol => {
      return new SignUpController()
    }

    it('should return 400 if no name is provided', async () => {
      const sut = makeSut()

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
      const expectedError = new MissingParamError('name')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })

    it('should return 400 if no email is provided', async () => {
      const sut = makeSut()

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
      const expectedError = new MissingParamError('email')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })

    it('should return 200 if all params is provided', async () => {
      const sut = makeSut()

      const fakeName = faker.name.firstName
      const fakeEmail = faker.internet.email
      const fakePassword = faker.internet.password

      const httpRequest = {
        body: {
          name: fakeName,
          email: fakeEmail,
          password: fakePassword,
          passwordConfirmation: fakePassword
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      const expectedStatusCode = 200

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
    })

    it('should return 400 if no password is provided', async () => {
      const sut = makeSut()

      const fakeName = faker.name.firstName
      const fakeEmail = faker.internet.email

      const httpRequest = {
        body: {
          name: fakeName,
          email: fakeEmail
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      const expectedStatusCode = 400
      const expectedError = new MissingParamError('password')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })

    it('should return 400 if no password is provided', async () => {
      const sut = makeSut()

      const fakeName = faker.name.firstName
      const fakeEmail = faker.internet.email
      const fakePassword = faker.internet.password

      const httpRequest = {
        body: {
          name: fakeName,
          email: fakeEmail,
          password: fakePassword
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      const expectedStatusCode = 400
      const expectedError = new MissingParamError('passwordConfirmation')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })
  })
})
