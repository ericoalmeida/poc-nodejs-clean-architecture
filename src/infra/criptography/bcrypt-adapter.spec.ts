import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt.adapter'

const HASHED_PASSWORD_MOCK = faker.internet.password()

jest.mock('bcrypt', () => ({
  async hashSync (): Promise<string> {
    return await new Promise(resolve => resolve(HASHED_PASSWORD_MOCK))
  }
}))

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

    it('Should returns hashed password on success', async () => {
      const bcryptSalt = 12

      const sut = new BcryptAdapter(bcryptSalt)

      const fakePassword = faker.internet.password()

      const hashedPassword = await sut.encrypt(fakePassword)

      expect(hashedPassword).toBe(HASHED_PASSWORD_MOCK)
    })
  })
})
