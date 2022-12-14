import { faker } from '@faker-js/faker'
import { AccountModel } from 'src/domain/models/account.model'

import { AddAccountModel, AddAccountUseCase } from 'src/domain/use-cases/add-account.usecase'
import { InternalServerError, InvalidParamError, MissingParamError } from '../../errors'
import { ControllerProtocol, EmailValidatorProtocol } from '../../protocols'
import { SignUpController } from './sign-up.controller'

const makeEmailValidator = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccountUseCase => {
  class AddAccountStub implements AddAccountUseCase {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const { name, email, password } = account

      const fakeAccount = {
        id: faker.datatype.uuid(),
        name,
        email,
        password
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

interface SutTypes {
  sut: ControllerProtocol
  emailValidatorStub: EmailValidatorProtocol
  addAccountStub: AddAccountUseCase
}

const makeSutTypes = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUpController', () => {
  describe('#handle', () => {
    it('should return 400 if no name is provided', async () => {
      const { sut } = makeSutTypes()

      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

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

      const fakeName = faker.name.firstName()
      const fakePassword = faker.internet.password()

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
      const { sut, addAccountStub } = makeSutTypes()

      const fakeId = faker.datatype.uuid()
      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => ({
        id: fakeId,
        name: fakeName,
        email: fakeEmail,
        password: fakePassword
      }))

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
      expect(httpResponse.body).toEqual({
        id: fakeId,
        name: fakeName,
        email: fakeEmail
      })
    })

    it('should return 400 if no password is provided', async () => {
      const { sut } = makeSutTypes()

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()

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

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

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

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

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

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

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
      const { sut, emailValidatorStub } = makeSutTypes()

      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

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

    it('should return 400 if password and passwordConfirmation does not match', async () => {
      const { sut } = makeSutTypes()

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()
      const fakePasswordConfirmation = faker.internet.password()

      const httpRequest = {
        body: {
          name: fakeName,
          email: fakeEmail,
          password: fakePassword,
          passwordConfirmation: fakePasswordConfirmation
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      const expectedStatusCode = 400
      const expectedError = new InvalidParamError('passwordConfirmation')

      expect(httpResponse.statusCode).toBe(expectedStatusCode)
      expect(httpResponse.body).toEqual(expectedError)
    })

    it('should call addAccount with correct values', async () => {
      const { sut, addAccountStub } = makeSutTypes()

      const addSpy = jest.spyOn(addAccountStub, 'add')

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

      const httpRequest = {
        body: {
          name: fakeName,
          email: fakeEmail,
          password: fakePassword,
          passwordConfirmation: fakePassword
        }
      }

      await sut.handle(httpRequest)

      expect(addSpy).toHaveBeenCalledWith({ name: fakeName, email: fakeEmail, password: fakePassword })
    })

    it('should return 500 if addAccount throws', async () => {
      const { sut, addAccountStub } = makeSutTypes()

      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
        throw new Error()
      })

      const fakeName = faker.name.firstName()
      const fakeEmail = faker.internet.email()
      const fakePassword = faker.internet.password()

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
