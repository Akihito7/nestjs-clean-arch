import { SearchableInMemoryRepository } from "@/shared/domain/repositories/searchable-in-memory-repository";
import { SortDirection } from "@/shared/domain/repositories/searchable.interface";
import { ConflictError } from "@/shared/errors/conflit-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";

export class UserInMemoryRepository
  extends SearchableInMemoryRepository<UserEntity>
  implements IUserRepository.Repository {

  sortableFields = ['name', 'createdAt']

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

  protected async applyFilter(items: UserEntity[], filter: string | null): Promise<UserEntity[]> {
    if (!filter) return items;
    return items.filter(user => user.name.toLowerCase().includes(filter.toLowerCase()))
  }
  
  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'DESC')
      : super.applySort(items, sort, sortDir)
  }
}

