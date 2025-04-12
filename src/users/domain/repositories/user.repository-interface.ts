import { InMemoryRepository } from "@/shared/domain/repositories/in-memory-repository";
import { UserEntity } from "../entities/user.entity";
import { SearchableInMemoryRepository } from "@/shared/domain/repositories/searchable-in-memory-repository";
import { ISearchableRepository } from "@/shared/domain/repositories/searchable.interface";

export interface IUserRepository extends ISearchableRepository<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>
}