import { faker } from '@faker-js/faker'

import { AddAccountUseCase, EncrypterProtocol } from './db-add-account.protocols'
import { DbAddAccountUseCase } from './db-add-account.usecase'

const makeEncrypterStub = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    async encrypt (password: string): Promise<string> {
      return await new Promise((resolve) => resolve(faker.internet.password()))
    }
  }

  return new EncrypterStub()
}

interface SutTypes {
  encrypterStub: EncrypterProtocol
  sut: AddAccountUseCase
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccountUseCase(encrypterStub)

  return {
    encrypterStub,
    sut
  }
}

describe('DbAddAccount', () => {
  describe('#add', () => {
    const accountData = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    it('Should call Encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut()

      const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

      await sut.add(accountData)

      expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
    })

    it('Should throw if encrypter throws', async () => {
      const { encrypterStub, sut } = makeSut()

      jest
        .spyOn(encrypterStub, 'encrypt')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const promise = sut.add(accountData)

      await expect(promise).rejects.toThrow()
    })
  })
})
