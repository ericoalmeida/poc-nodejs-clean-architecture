import { HttpResponseProtocol } from '../protocols/http-response.protocol'

export const basRequest = (error: Error): HttpResponseProtocol => ({
  statusCode: 400,
  body: error
})
