import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";
import { BaseRepository } from "@/shared/domain/repositories/base-repository.interface";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";

export namespace DeleteUser {

  export interface Input {
    id: UUIDTypes | string;
  }

  export type Output = void;

  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(private readonly userRepository: IUserRepository.Repository) { }
    async execute(input: Input): Promise<Output> {
      
      const { id } = input;

      if (!id) throw new BadRequestError('Input is not provided');

      await this.userRepository.delete(id);
    }
  }
}