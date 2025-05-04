import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";
import { IUserOutput, UserOutputMapper } from "../dtos/user-output";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";

export namespace UpdateUser {

  export interface Input {
    id: UUIDTypes | string,
    name: string;
  }

  export type Output = IUserOutput;

  export class UseCase implements BaseUseCase<Input, Output> {

    constructor(private readonly userRepository: IUserRepository.Repository) { };

    async execute(input: Input): Promise<Output> {

      const { id, name } = input;

      if (!name) throw new BadRequestError('Input is not provided')

      const userEntity = await this.userRepository.findById(id.toString());

      if (!userEntity) throw new NotFoundError(`User with ${id} not found`);

      userEntity.update(name);

      await this.userRepository.update(userEntity);

      return UserOutputMapper.toOutput(userEntity)

    }
  }
}
