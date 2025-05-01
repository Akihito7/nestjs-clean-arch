import { NotFoundError } from "@/shared/errors/not-found-error";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";


export namespace GetUserUseCase {
  interface Input {
    id: UUIDTypes | string
  }

  interface Output {
    id: UUIDTypes | undefined;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  export class UseCase {
    constructor(private readonly userRepository: IUserRepository.Repository) { }
    async execute({ id }: Input): Promise<Output | undefined> {
      const entity = await this.userRepository.findById(id as string);
      if (!entity) {
        throw new NotFoundError('Entity not found.')
      }
      return entity.toJson()
    }
  }
}
