import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { BadRequestError } from "../errors/bad-request-error";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { UUIDTypes } from "uuid";
import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";

export namespace SignupUseCase {
  interface Input {
    name: string;
    email: string;
    password: string;
  }

  export interface Output {
    id: UUIDTypes | undefined;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(
      private readonly userRepository: IUserRepository.Repository,
      private readonly hashProvider: IHashProvider
    ) { }
    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;
      if (!name || !email || !password) {
        throw new BadRequestError("Input data is not provided.")
      }
      await this.userRepository.emailExists(email);
      const hashPassword = await this.hashProvider.generateHash(password)
      const userEntity = new UserEntity({ ...input, password: hashPassword });
      await this.userRepository.insert(userEntity)
      return userEntity.toJson()
    }
  }
}

