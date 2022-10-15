import { HttpRequestProtocol } from './http-request.protocol'
import { HttpResponseProtocol } from './http-response.protocol'

export interface ControllerProtocol {
  handle: (httpRequest: HttpRequestProtocol) => Promise<HttpResponseProtocol>
}
