import { faker } from '@faker-js/faker'

import { EmailValidatorProtocol } from 'src/presentation/protocols'
import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorProtocol => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  describe('#isValid', () => {
    it('Should return false if validator returns false', () => {
      const sut = makeSut()
      jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

      const invalidEmail = faker.random.word()
      const emailIsValid = sut.isValid(invalidEmail)

      expect(emailIsValid).toBe(false)
    })

    it('Should return true if validator returns true', () => {
      const sut = makeSut()

      const fakeEmail = faker.internet.email()
      const emailIsValid = sut.isValid(fakeEmail)

      expect(emailIsValid).toBe(true)
    })

    it('Should calls EmailValidatorAdapter.isValid with correct email', () => {
      const sut = makeSut()

      const isEmailSpyOn = jest.spyOn(validator, 'isEmail')

      const fakeEmail = faker.internet.email()
      sut.isValid(fakeEmail)

      expect(isEmailSpyOn).toHaveBeenCalledWith(fakeEmail)
    })
  })
})
