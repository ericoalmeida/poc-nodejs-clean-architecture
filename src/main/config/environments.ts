const defaultMongoUrl = 'mongodb://localhost:27017/clean-arch'
const defaultPort = 3000

export default {
  mongoUrl: process.env.MONGO_URL ?? defaultMongoUrl,
  port: process.env.PORT ?? defaultPort
}
