import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";
import { InvalidCredentialsError } from "@/shared/errors/invalid-credentials-error";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { IUserOutput, UserOutputMapper } from "../dtos/user-output";

export namespace Signln {

  export interface Input {
    email: string;
    password: string;
  }

  export type Output = IUserOutput;

  export class UseCase implements BaseUseCase<Input, Output> {

    constructor(
      private readonly userRepository: IUserRepository.Repository,
      private readonly hashProvider: IHashProvider
    ) { }

    async execute(input: Input): Promise<Output> {

      const { email, password } = input;

      if (!email || !password) throw new BadRequestError('Input data is not provided.');

      const userEntity = await this.userRepository.findByEmail(email);

      if (!userEntity) throw new NotFoundError(`User with this email ${email} not found.`);

      const passwordIsMatch = await this.hashProvider.compare(password, userEntity.password);

      if (!passwordIsMatch) throw new InvalidCredentialsError('Invalid credentials')

      return UserOutputMapper.toOutput(userEntity)
    }
  }
}