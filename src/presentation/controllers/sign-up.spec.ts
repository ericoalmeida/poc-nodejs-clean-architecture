import { faker } from '@faker-js/faker'

import { InternalServerError, InvalidParamError, MissingParamError } from '../errors'
import { ControllerProtocol, EmailValidatorProtocol } from '../protocols'
import { SignUpController } from './sign-up.controller'

interface SutTypes {
  sut: ControllerProtocol
  emailValidatorStub: EmailValidatorProtocol
}

const makeEmailValidator = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeEmailValidatorError = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isValid (email: string): boolean {
      throw new Error('Internal serve error')
    }
  }

  return new EmailValidatorStub()
}

const makeSutTypes = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUpController', () => {
  describe('#handle', () => {
    it('should return 400 if no name is provided', async () => {
      const { sut } = makeSutTypes()

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
      const { sut } = makeSutTypes()

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
      const { sut } = makeSutTypes()

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
      const { sut } = makeSutTypes()

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
      const { sut } = makeSutTypes()

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

    it('should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSutTypes()

      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

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
      const expectedStatusCode = 400
      const expectedError = new InvalidParamError('email')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })

    it('should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSutTypes()

      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

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

      await sut.handle(httpRequest)

      expect(isValidSpy).toHaveBeenCalledWith(fakeEmail)
    })

    it('should return 500 if EmailValidator throws', async () => {
      const emailValidatorStub = makeEmailValidatorError()
      const sut = new SignUpController(emailValidatorStub)

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
      const expectedStatusCode = 500
      const expectedError = new InternalServerError()

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })
  })
})
