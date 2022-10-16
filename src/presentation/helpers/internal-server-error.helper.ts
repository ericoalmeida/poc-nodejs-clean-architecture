import { HttpResponseProtocol } from '../protocols'

export const internalServerError = (error: Error): HttpResponseProtocol => ({
  statusCode: 500,
  body: error
})
