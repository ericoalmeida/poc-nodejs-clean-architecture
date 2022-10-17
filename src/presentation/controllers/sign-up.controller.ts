import { AddAccountUseCase } from 'src/domain/use-cases/add-account.usecase'
import { InternalServerError, InvalidParamError, MissingParamError } from '../errors'
import { badRequest, internalServerError } from '../helpers'
import { ControllerProtocol, EmailValidatorProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../protocols'

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

      await this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: { success: true }
      }
    } catch (error) {
      return internalServerError(new InternalServerError())
    }
  }
}
