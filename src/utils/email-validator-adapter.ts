import { EmailValidatorProtocol } from 'src/presentation/protocols'

export class EmailValidatorAdapter implements EmailValidatorProtocol {
  isValid (email: string): boolean {
    return false
  }
}
