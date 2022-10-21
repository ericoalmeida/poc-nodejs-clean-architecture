import { AccountModel, AddAccountModel, AddAccountUseCase, EncrypterProtocol } from './db-add-account.protocols'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly encrypter: EncrypterProtocol) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = account

    const encryptedPassword = await this.encrypter.encrypt(password)

    return await new Promise(resolve => resolve({ id: '', email, name, password: encryptedPassword }))
  }
}
