import { DbAddAccountUseCase } from '../../data/use-cases/add-account/db-add-account.usecase'
import { BcryptAdapter } from '../../infra/criptography/bcrypt.adapter'
import { AccountRepository } from '../../infra/db/mongodb/account/account.repository'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up.controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const signUpFactory = (): SignUpController => {
  const saltEncrypter = 12

  const encrypter = new BcryptAdapter(saltEncrypter)
  const repository = new AccountRepository()
  const addAccount = new DbAddAccountUseCase(encrypter, repository)
  const emailValidator = new EmailValidatorAdapter()

  return new SignUpController(emailValidator, addAccount)
}
