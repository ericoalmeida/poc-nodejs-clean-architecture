import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt.adapter'

describe('BCryptAdapter', () => {
  describe('#encrypt', () => {
    it('Should calls bcrypt with correct password', async () => {
      const bcryptSalt = 12

      const sut = new BcryptAdapter(bcryptSalt)
      const hashSpy = jest.spyOn(bcrypt, 'hashSync')

      const expectedCalledTimes = 1
      const fakePassword = faker.internet.password()

      await sut.encrypt(fakePassword)

      expect(hashSpy).toHaveBeenCalledTimes(expectedCalledTimes)
      expect(hashSpy).toHaveBeenCalledWith(fakePassword, bcryptSalt)
    })
  })
})
