import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { BadRequestError } from "../errors/bad-request-error";

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
    constructor(private readonly userRepository: IUserRepository.Repository) { }
    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;
      if (!name || !email || !password) {
        throw new BadRequestError("Input data is not provided.")
      }
      await this.userRepository.emailExists(email);
      const userEntity = new UserEntity({ email, name, password });
      await this.userRepository.insert(userEntity)
      return userEntity.toJson()
    }
  }
}

