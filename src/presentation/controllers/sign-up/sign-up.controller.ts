import { InternalServerError, InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, internalServerError, successRequest } from '../../helpers'
import {
  AddAccountUseCase,
  ControllerProtocol,
  EmailValidatorProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol
} from './sign-up.protocols'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly emailValidator: EmailValidatorProtocol,
    private readonly addAccount: AddAccountUseCase
  ) {}

  public async handle (httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const accountCreated = await this.addAccount.add({
        name,
        email,
        password
      })

      return successRequest({
        id: accountCreated.id,
        name: accountCreated.name,
        email: accountCreated.email
      }
      )
    } catch (error) {
      return internalServerError(new InternalServerError())
    }
  }
}
