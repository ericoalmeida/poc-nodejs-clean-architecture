import { faker } from '@faker-js/faker'
import { EncrypterProtocol } from 'src/data/protocols/encrypter.protocol'
import { AddAccountUseCase } from 'src/domain/use-cases/add-account.usecase'
import { DbAddAccountUseCase } from './db-add-account.usecase'

const makeEncrypterStub = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    async encrypt (password: string): Promise<string> {
      return await new Promise(resolve => resolve(faker.internet.password()))
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
    it('Should call Encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut()

      const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

      const accountData = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }

      await sut.add(accountData)

      expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
    })
  })
})
