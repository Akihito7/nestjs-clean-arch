import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module";
import { Test, TestingModule } from "@nestjs/testing"
import { UsersModule } from "../../users.module";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaClient } from "@prisma/client";
import request from "supertest"
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UsersController } from "../../users.controller";
import { instanceToPlain } from "class-transformer";
import { globalMainConfig } from "@/global-main-config";
import { INestApplication } from "@nestjs/common";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { SearchParams } from "@/shared/domain/repositories/searchable.interface";
import { URLSearchParams } from "node:url";

describe('UsersController (e2e) - GET /users', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  let prismaService: PrismaClient;
  let repository: IUserRepository.Repository
  let entity: UserEntity;

  beforeAll(async () => {
    setupPrismaTest();

    prismaService = new PrismaClient();

    appModule = await Test.createTestingModule({
      imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService as any)]
    }).compile();

    repository = appModule.get<IUserRepository.Repository>('UserRepository')

    app = appModule.createNestApplication();

    await globalMainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  it('should find one user', async () => {
    const entities = Array.from({ length: 3 })
      .map((_, index) => new UserEntity(userDateBuilder({
        createdAt: new Date((new Date().getTime() + index))
      })));

    await prismaService.user.createMany({ data: entities.map(item => ({ ...item.toJson(), id: item.id!.toString() })) });

    const searchParams = {}

    const queryParams = new URLSearchParams(searchParams as any).toString();

    const response = await request(app.getHttpServer()).get(`/users?${queryParams}`).expect(200);

    expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);

    expect(response.body).toStrictEqual({
      data: entities.reverse().map(item => instanceToPlain(UsersController.userToResponse(item.toJson()))),
      meta: { currentPage: 1, perPage: 15, lastPage: 1, total: 3 }
    })

  })

  it('should return a error with 422 when param fake is provided', async () => {
    await request(app.getHttpServer()).get(`/users?fakeParam=null`).expect(422).expect({
      message: ['property fakeParam should not exist'],
      error: 'Unprocessable Entity',
      statusCode: 422
    })
  })
})