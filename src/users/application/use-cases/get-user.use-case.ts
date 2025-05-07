import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";
import { UserOutputMapper } from "../dtos/user-output";


export namespace GetUserUseCase {
  interface Input {
    id: UUIDTypes | string
  }

  export interface Output {
    id: UUIDTypes | undefined;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  export class UseCase implements BaseUseCase<Input, Output> {
    constructor(private readonly userRepository: IUserRepository.Repository) { }
    async execute({ id }: Input): Promise<Output> {
      const entity = await this.userRepository.findById(id as string);
      if (!entity) {
        throw new NotFoundError('Entity not found.')
      }
      return UserOutputMapper.toOutput(entity)
    }
  }
}
