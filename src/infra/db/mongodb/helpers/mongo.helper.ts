/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Collection, Db, MongoClient } from 'mongodb'

export class MongoHelper {
  static connection: MongoClient
  static db: Db

  static async connect (uri: string): Promise<void> {
    this.connection = await MongoClient.connect(uri)
    this.db = this.connection.db()
  }

  static async disconnect (): Promise<void> {
    await this.connection.close()
  }

  static async getCollection (name: string): Promise<Collection> {
    return this.db.collection(name)
  }
}
