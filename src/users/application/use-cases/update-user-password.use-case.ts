import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";
import { IUserOutput, UserOutputMapper } from "../dtos/user-output";
import { InvalidPasswordError } from "@/shared/errors/invalid-password-error";

export namespace UpdateUserPassword {

  export interface Input {
    id: UUIDTypes | string;
    oldPassword: string;
    newPassword: string;
  }

  export type Output = IUserOutput;

  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(
      private readonly userRepository: IUserRepository.Repository,
      private readonly hashProvider: IHashProvider
    ) { }

    async execute(input: any): Promise<Output> {

      const { id, oldPassword, newPassword } = input;

      if (!id || !newPassword || oldPassword) throw new BadRequestError('Input is not provided.');

      const userEntity = await this.userRepository.findById(id.toString());

      if (!userEntity) throw new NotFoundError(`User with id ${id} not found.`);

      const oldPasswordIsMatch = this.hashProvider.compare(oldPassword, userEntity.password)

      if (!oldPasswordIsMatch) throw new InvalidPasswordError('Old password does not match')

      const passwordHashed = await this.hashProvider.generateHash(newPassword);

      userEntity.updatePassword(passwordHashed);

      await this.userRepository.update(userEntity);

      return UserOutputMapper.toOutput(userEntity);

    }
  }
}