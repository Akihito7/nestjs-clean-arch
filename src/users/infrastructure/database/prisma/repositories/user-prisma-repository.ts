import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UUIDTypes } from "uuid";
import { UserModelMapper } from "../models/user-model-mapper";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { SearchResult, SortDirection } from "@/shared/domain/repositories/searchable.interface";
import { Prisma } from "@prisma/client";

export class UserPrismaRepository implements IUserRepository.Repository {

  constructor(private readonly prismaService: PrismaService) { }

  sortableFields: string[] = ['name', 'createdAt'];

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  emailExists(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async search(props: IUserRepository.SearchParams): Promise<IUserRepository.SearchResult> {

    const { filter, page, perPage, sort, sortDir } = props;

    const DEFAULT_SORT = 'createdAt';

    const sortField = sort && this.sortableFields.includes(sort) ? sort : DEFAULT_SORT;
    const sortDirection: SortDirection = sortDir ? sortDir : 'DESC';

    const where: Prisma.UserWhereInput | undefined = filter
      ? { name: { contains: filter, mode: 'insensitive' } }
      : undefined;

    const totalUsers = await this.prismaService.user.count({ where })

    const modelUsers = await this.prismaService.user.findMany({
      where,
      orderBy: {
        [sortField]: sortDirection.toLowerCase() as Prisma.SortOrder
      },
      take: perPage && perPage > 0 ? perPage : 15,
      skip: page && page > 0 ? (page - 1) * perPage : 0
    })

    return new SearchResult({
      items: modelUsers.map(UserModelMapper.toEntity),
      currentPage: page,
      perPage,
      total: totalUsers,
      filter,
      sort,
      sortDir,
    })
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

  async update(entity: UserEntity): Promise<void> {
    const { id, name, email, } = entity.toJson();
    await this._getById(id!.toString())
    await this.prismaService.user.update({
      data: {
        name,
        email
      },
      where: {
        id: id!.toString()
      }
    })

  }

  async delete(id: UUIDTypes): Promise<void> {
    await this._getById(id.toString());
    await this.prismaService.user.delete({ where: { id: id.toString() } })
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