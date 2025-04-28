export interface IHashProvider {
  generateHash(payload: string): Promise<String>
  compare(payload: string, hash: string): Promise<Boolean>
}