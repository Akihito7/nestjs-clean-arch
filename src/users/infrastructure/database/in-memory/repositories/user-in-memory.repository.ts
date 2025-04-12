import { SearchableInMemoryRepository } from "@/shared/domain/repositories/searchable-in-memory-repository";
import { ConflictError } from "@/shared/errors/conflit-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";

export class UserInMemoryRepository
  extends SearchableInMemoryRepository<UserEntity, any, any>
  implements IUserRepository {

  async findByEmail(email: string): Promise<UserEntity> {
    const user = this.items.find(user => user.email === email)
    if (!user) {
      throw new ConflictError(`User with this email ${email} not found.`)
    }
    return user;
  }
  async emailExists(email: string): Promise<void> {
    const user = this.items.find(user => user.email === email)
    if (user) {
      throw new ConflictError(`Email ${email} exists.`);
    }
  }

}

