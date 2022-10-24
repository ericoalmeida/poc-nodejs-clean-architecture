import { Document } from 'mongodb'
import { AccountModel } from 'src/domain/models/account.model'

export const map = (document: Document): AccountModel => {
  const { _id, name, email, password } = document

  return { id: _id, name, email, password }
}
