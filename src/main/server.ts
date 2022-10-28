import { MongoHelper } from '../infra/db/mongodb/helpers/mongo.helper'
import Env from './config/environments'

MongoHelper
  .connect(Env.mongoUrl)
  .then(async () => {
    const { app } = (await import('./config/app.config'))

    app.listen(Env.port, () => console.log('Server started'))
  })
  .catch((error) => {
    console.log(error)
  })
