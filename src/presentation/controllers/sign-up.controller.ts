import { HttpRequestProtocol } from '../protocols/http-request.protocol'
import { HttpResponseProtocol } from '../protocols/http-response.protocol'

export class SignUpController {
  public async handle (httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }

    return {
      statusCode: 200,
      body: { status: true }
    }
  }
}
