import { HttpResponseProtocol } from '../protocols'

export const successRequest = (data: any): HttpResponseProtocol => ({
  statusCode: 200,
  body: data
})
