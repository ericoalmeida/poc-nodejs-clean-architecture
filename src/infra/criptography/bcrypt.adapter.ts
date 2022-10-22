import bcrypt from 'bcrypt'

import { EncrypterProtocol } from 'src/data/protocols/encrypter.protocol'

export class BcryptAdapter implements EncrypterProtocol {
  constructor (private readonly salt: number) {}

  async encrypt (password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt)
  }
}
