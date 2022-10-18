import { faker } from '@faker-js/faker'
import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  describe('#isValid', () => {
    it('Should return false if validator returns false', () => {
      const sut = new EmailValidatorAdapter()
      const emailIsValid = sut.isValid(faker.internet.email())

      expect(emailIsValid).toBe(false)
    })
  })
})
