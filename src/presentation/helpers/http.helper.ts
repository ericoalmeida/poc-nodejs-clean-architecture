import { HttpResponseProtocol } from '../protocols/http-response.protocol'

export const badRequest = (error: Error): HttpResponseProtocol => ({
  statusCode: 400,
  body: error
})

export const internalServerError = (error: Error): HttpResponseProtocol => ({
  statusCode: 500,
  body: error
})
