import { hash, compare } from "bcrypt"
import { IHashProvider } from "@/shared/application/providers/hash.provider";

export class BcryptjsHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 8)
  }
  async compare(payload: string, hash: string): Promise<Boolean> {
    return compare(payload, hash)
  }
}