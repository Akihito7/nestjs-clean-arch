import { InMemoryRepository } from "@/shared/domain/repositories/in-memory-repository";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository extends InMemoryRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>
}