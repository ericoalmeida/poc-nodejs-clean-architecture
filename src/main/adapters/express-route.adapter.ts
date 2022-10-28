import { Request, Response } from 'express'
import { ControllerProtocol, HttpRequestProtocol } from 'src/presentation/protocols'

export const expressRouteAdapter = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequestProtocol = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
