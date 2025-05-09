import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";

export class UserPrismaRepository implements IUserRepository.Repository {

  constructor(private readonly prismaService: PrismaService) { }
  
  sortableFields: string[];

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  emailExists(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  search(props: IUserRepository.SearchParams): Promise<IUserRepository.SearchResult> {
    throw new Error("Method not implemented.");
  }

  insert(entity: UserEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(id: string): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }

  findAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(id: UUIDTypes): Promise<void> {
    throw new Error("Method not implemented.");
  }

}