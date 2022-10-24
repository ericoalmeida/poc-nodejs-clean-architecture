import { faker } from '@faker-js/faker'
import { AddAccountRepositoryProtocol } from 'src/data/protocols/add-account-repository.protocol'
import { MongoHelper } from '../helpers/mongo.helper'
import { AccountRepository } from './account.repository'

const COLLECTION_NAME = 'accounts'

const makeSut = (): AddAccountRepositoryProtocol => {
  return new AccountRepository()
}

describe('Account Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    await accountCollection.deleteMany({})
  })

  it('should insert a doc into collection', async () => {
    const sut = makeSut()

    const accountData = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const accountCreated = await sut.add(accountData)

    expect(accountCreated).toBeTruthy()
    expect(accountCreated.id).toBeTruthy()
    expect(accountCreated.name).toBe(accountData.name)
    expect(accountCreated.email).toBe(accountData.email)
    expect(accountCreated.password).toBe(accountData.password)
  })
})
