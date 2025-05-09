import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";
import { UserModelMapper } from "../models/user-model-mapper";
import { NotFoundError } from "@/shared/errors/not-found-error";

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

  async insert(entity: UserEntity): Promise<void> {
    const data = entity.toJson();
    await this.prismaService.user.create({
      data: {
        ...data,
        id: data.id!.toString(),
      },
    });

  }

  async findById(id: string): Promise<UserEntity> {
    return this._getById(id)
  }

  async findAll(): Promise<UserEntity[]> {
    const modelUsers = await this.prismaService.user.findMany();
    return modelUsers.map(modelUser => UserModelMapper.toEntity(modelUser))
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(id: UUIDTypes): Promise<void> {
    throw new Error("Method not implemented.");
  }

  protected async _getById(id: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id }
      })
      return UserModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`User with this id ${id} not found.`)
    }
  }

}