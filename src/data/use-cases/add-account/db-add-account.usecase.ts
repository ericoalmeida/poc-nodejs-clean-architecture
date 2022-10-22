import { AccountModel, AddAccountModel, AddAccountRepositoryProtocol, AddAccountUseCase, EncrypterProtocol } from './db-add-account.protocols'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (
    private readonly encrypter: EncrypterProtocol,
    private readonly addAccountRepository: AddAccountRepositoryProtocol
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = account

    const encryptedPassword = await this.encrypter.encrypt(password)

    await this.addAccountRepository.add({ name: account.name, email: account.email, password: encryptedPassword })

    return await new Promise(resolve => resolve({ id: '', email, name, password: encryptedPassword }))
  }
}
