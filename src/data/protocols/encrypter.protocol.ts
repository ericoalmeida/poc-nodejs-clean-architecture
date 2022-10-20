export interface EncrypterProtocol {
  encrypt: (password: string) => Promise<string>
}
