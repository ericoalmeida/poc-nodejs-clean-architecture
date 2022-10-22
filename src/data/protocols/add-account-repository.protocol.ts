import { AccountModel } from '../../domain/models/account.model'
import { AddAccountModel } from '../../domain/use-cases/add-account.usecase'

export interface AddAccountRepositoryProtocol {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
