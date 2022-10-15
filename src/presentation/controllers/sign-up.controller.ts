import { MissingParamError } from '../errors/missing-param.error'
import { basRequest } from '../helpers/http.helper'
import { HttpRequestProtocol } from '../protocols/http-request.protocol'
import { HttpResponseProtocol } from '../protocols/http-response.protocol'

export class SignUpController {
  public async handle (httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return basRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: { status: true }
    }
  }
}
