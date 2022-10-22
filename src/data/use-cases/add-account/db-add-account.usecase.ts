import { AccountModel, AddAccountModel, AddAccountRepositoryProtocol, AddAccountUseCase, EncrypterProtocol } from './db-add-account.protocols'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (
    private readonly encrypter: EncrypterProtocol,
    private readonly addAccountRepository: AddAccountRepositoryProtocol
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = account

    const encryptedPassword = await this.encrypter.encrypt(password)

    const accountCreated = await this.addAccountRepository.add({ name, email, password: encryptedPassword })

    return accountCreated
  }
}
