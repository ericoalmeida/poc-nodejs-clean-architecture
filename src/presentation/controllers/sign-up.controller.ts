import { InvalidParamError } from '../errors/invalid-param.error'
import { MissingParamError } from '../errors/missing-param.error'
import { basRequest } from '../helpers/http.helper'
import { ControllerProtocol } from '../protocols/controller.protocol'
import { EmailValidator } from '../protocols/email-validator.protocol'
import { HttpRequestProtocol } from '../protocols/http-request.protocol'
import { HttpResponseProtocol } from '../protocols/http-response.protocol'

export class SignUpController implements ControllerProtocol {
  constructor (private readonly emailValidator: EmailValidator) {}

  public async handle (httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return basRequest(new MissingParamError(field))
      }
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!emailIsValid) {
      return basRequest(new InvalidParamError('email'))
    }

    return {
      statusCode: 200,
      body: { status: true }
    }
  }
}
