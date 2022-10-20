import { EncrypterProtocol } from 'src/data/protocols/encrypter.protocol'
import { AccountModel } from 'src/domain/models/account.model'
import { AddAccountModel, AddAccountUseCase } from 'src/domain/use-cases/add-account.usecase'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly encrypter: EncrypterProtocol) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = account

    const encryptedPassword = await this.encrypter.encrypt(password)

    return await new Promise(resolve => resolve({ id: '', email, name, password: encryptedPassword }))
  }
}
