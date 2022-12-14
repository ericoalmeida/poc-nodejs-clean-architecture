import express, { Express } from 'express'

import setupMiddlewares from './middlewares.config'
import setupRoutes from './routes.config'

const app: Express = express()

setupMiddlewares(app)
setupRoutes(app)

export { app }
