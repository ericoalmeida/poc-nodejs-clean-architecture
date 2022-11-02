import { MongoHelper as sut } from './mongo.helper'

describe('Mongo helper', () => {
  beforeAll(async () => {
    await sut.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  describe('#connect', () => {
    it('Should reconnect if mongodb is down', async () => {
      let collection = await sut.getCollection('accounts')

      await sut.disconnect()

      collection = await sut.getCollection('accounts')

      expect(collection).toBeTruthy()
    })
  })
})
