import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

import { EncrypterProtocol } from 'src/data/protocols/encrypter.protocol'
import { BcryptAdapter } from './bcrypt.adapter'

const HASHED_PASSWORD_MOCK = faker.internet.password()

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve(HASHED_PASSWORD_MOCK))
  }
}))

const bcryptSalt = 12
const makeSut = (): EncrypterProtocol => new BcryptAdapter(bcryptSalt)

describe('BCryptAdapter', () => {
  describe('#encrypt', () => {
    it('Should calls bcrypt with correct password', async () => {
      const bcryptSalt = 12

      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      const expectedCalledTimes = 1
      const fakePassword = faker.internet.password()

      await sut.encrypt(fakePassword)

      expect(hashSpy).toHaveBeenCalledTimes(expectedCalledTimes)
      expect(hashSpy).toHaveBeenCalledWith(fakePassword, bcryptSalt)
    })

    it('Should returns hashed password on success', async () => {
      const sut = makeSut()

      const fakePassword = faker.internet.password()

      const hashedPassword = await sut.encrypt(fakePassword)

      expect(hashedPassword).toBe(HASHED_PASSWORD_MOCK)
    })
  })
})
