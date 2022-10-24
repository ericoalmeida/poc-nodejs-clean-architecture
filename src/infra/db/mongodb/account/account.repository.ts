import { Document } from 'mongodb'
import { AddAccountRepositoryProtocol } from 'src/data/protocols/add-account-repository.protocol'
import { AccountModel } from 'src/domain/models/account.model'
import { AddAccountModel } from 'src/domain/use-cases/add-account.usecase'
import { MongoHelper } from '../helpers/mongo.helper'
import { map } from './account.mapper'

type AccountRepositoryProtocol = AddAccountRepositoryProtocol

export class AccountRepository implements AccountRepositoryProtocol {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')

    const result = await collection.insertOne(account)
    const accountCreated = await collection.findOne({
      _id: result.insertedId
    }) as Document

    return map(accountCreated)
  }
}
