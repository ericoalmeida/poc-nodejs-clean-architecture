import { AccountModel } from '../models/account.model'

export interface AddAccountModel {
  name: string
  email: string
  password: string

}

export interface AddAccountUseCase {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
