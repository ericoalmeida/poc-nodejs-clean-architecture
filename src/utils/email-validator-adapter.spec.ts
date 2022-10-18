import { faker } from '@faker-js/faker'
import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  describe('#isValid', () => {
    it('Should return false if validator returns false', () => {
      const sut = new EmailValidatorAdapter()

      const invalidEmail = faker.random.word()
      const emailIsValid = sut.isValid(invalidEmail)

      expect(emailIsValid).toBe(false)
    })
  })
})
