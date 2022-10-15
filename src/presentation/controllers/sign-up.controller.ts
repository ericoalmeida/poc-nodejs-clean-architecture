import { InternalServerError } from '../errors/internal-server.error'
import { InvalidParamError } from '../errors/invalid-param.error'
import { MissingParamError } from '../errors/missing-param.error'
import { badRequest, internalServerError } from '../helpers/http.helper'
import { ControllerProtocol, EmailValidatorProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../protocols'

export class SignUpController implements ControllerProtocol {
  constructor (private readonly emailValidator: EmailValidatorProtocol) {}

  public async handle (httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 200,
        body: { status: true }
      }
    } catch (error) {
      return internalServerError(new InternalServerError())
    }
  }
}
