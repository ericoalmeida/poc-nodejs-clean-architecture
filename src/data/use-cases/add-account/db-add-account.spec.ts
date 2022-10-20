import { faker } from '@faker-js/faker'
import { EncrypterProtocol } from 'src/data/protocols/encrypter.protocol'
import { DbAddAccountUseCase } from './db-add-account.usecase'

describe('DbAddAccount', () => {
  describe('#add', () => {
    it('Should call Encrypter with correct password', async () => {
      class EncrypterStub implements EncrypterProtocol {
        async encrypt (password: string): Promise<string> {
          return await new Promise(resolve => resolve(faker.internet.password()))
        }
      }

      const encrypterStub = new EncrypterStub()
      const sut = new DbAddAccountUseCase(encrypterStub)

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
