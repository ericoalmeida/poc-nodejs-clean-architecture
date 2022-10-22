import { faker } from '@faker-js/faker'

import { AccountModel, AddAccountModel, AddAccountRepositoryProtocol, AddAccountUseCase, EncrypterProtocol } from './db-add-account.protocols'
import { DbAddAccountUseCase } from './db-add-account.usecase'

const ENCRYPTED_PASSWORD = faker.internet.password()
const FAKE_ACCOUNT = {
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: ENCRYPTED_PASSWORD
}

const makeAddAccountRepositoryStub = (): AddAccountRepositoryProtocol => {
  class AddAccountRepositoryStub implements AddAccountRepositoryProtocol {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(FAKE_ACCOUNT))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypterStub = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    async encrypt (password: string): Promise<string> {
      return await new Promise((resolve) => resolve(ENCRYPTED_PASSWORD))
    }
  }

  return new EncrypterStub()
}

interface SutTypes {
  encrypterStub: EncrypterProtocol
  addAccountRepositoryStub: AddAccountRepositoryProtocol
  sut: AddAccountUseCase
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccountUseCase(encrypterStub, addAccountRepositoryStub)

  return {
    encrypterStub,
    addAccountRepositoryStub,
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

    it('Should call AddAccountRepository with correct value', async () => {
      const { addAccountRepositoryStub, sut } = makeSut()

      const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

      const accountData = {
        name: FAKE_ACCOUNT.name,
        email: FAKE_ACCOUNT.email,
        password: ENCRYPTED_PASSWORD
      }

      await sut.add(accountData)

      expect(addSpy).toHaveBeenCalledWith(accountData)
    })

    it('Should throw if AddAccountRepository throws', async () => {
      const { addAccountRepositoryStub, sut } = makeSut()

      jest
        .spyOn(addAccountRepositoryStub, 'add')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const promise = sut.add(accountData)

      await expect(promise).rejects.toThrow()
    })
  })
})
