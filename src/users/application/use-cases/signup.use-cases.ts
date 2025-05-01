import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { BadRequestError } from "../errors/bad-request-error";
import { IHashProvider } from "@/shared/application/providers/hash.provider";

export namespace SignupUseCase {
  interface Input {
    name: string;
    email: string;
    password: string;
  }

  interface Output {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  export class UseCase {
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

