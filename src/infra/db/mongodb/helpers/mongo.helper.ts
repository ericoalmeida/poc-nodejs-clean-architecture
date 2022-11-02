/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Collection, Db, MongoClient } from 'mongodb'

export class MongoHelper {
  static connection: MongoClient | null
  static db: Db
  static url: string

  static async connect (url: string): Promise<void> {
    this.url = url

    this.connection = await MongoClient.connect(this.url)
    this.db = this.connection.db()
  }

  static async disconnect (): Promise<void> {
    this.connection && await this.connection.close()
    this.connection = null
  }

  static async getCollection (name: string): Promise<Collection> {
    if (!this.connection) {
      await this.connect(this.url)
    }

    return this.db.collection(name)
  }
}
