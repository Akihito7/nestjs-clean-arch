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
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";

describe('UsersController (e2e) - GET /users', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  let prismaService: PrismaClient;
  let repository: IUserRepository.Repository
  let entity: UserEntity;
  let hashProvider: IHashProvider;
  let token: string;

  beforeAll(async () => {
    setupPrismaTest();

    prismaService = new PrismaClient();

    appModule = await Test.createTestingModule({
      imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService as any)]
    }).compile();

    repository = appModule.get<IUserRepository.Repository>('UserRepository');
    hashProvider = new BcryptjsHashProvider();

    app = appModule.createNestApplication();

    await globalMainConfig(app);

    await app.init();
  });

  beforeEach(async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    entity = new UserEntity(userDateBuilder({
      password: hashPassword,
      createdAt: new Date(Date.now() + 10 * 60 * 1000)
    }));

    await repository.insert(entity);

    const loginResponse = await request(app.getHttpServer()).post('/users/signln').send({
      email: entity.email,
      password: '1234',
    });

    token = loginResponse.body.acessToken
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  it('should return users ordered default way', async () => {
    const entities = Array.from({ length: 3 })
      .map((_, index) => new UserEntity(userDateBuilder({
        createdAt: new Date((new Date().getTime() + index))
      })));

    await prismaService.user.createMany({ data: entities.map(item => ({ ...item.toJson(), id: item.id!.toString() })) });

    const searchParams = {}

    const queryParams = new URLSearchParams(searchParams as any).toString();

    const response = await request(app.getHttpServer())
      .get(`/users?${queryParams}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Object.keys(response.body)).toStrictEqual(['data', 'meta']);

    entities.push(entity)

    expect(response.body).toStrictEqual({
      data: entities.reverse().map(item => instanceToPlain(UsersController.userToResponse(item.toJson()))),
      meta: { currentPage: 1, perPage: 15, lastPage: 1, total: 4 }
    })

  })

  it('should return the users ordered by createdAt', async () => {
    const entities: UserEntity[] = []
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...userDateBuilder({}),
          name: element,
          email: `a${index}@a.com`,
        }),
      )
    })
    await prismaService.user.createMany({
      data: entities.map(item => ({ ...item.toJson(), id: item.id!.toString() })),
    })
    const searchParams = {
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    }
    const queryParams = new URLSearchParams(searchParams as any).toString()

    const res = await request(app.getHttpServer())
      .get(`/users/?${queryParams}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
    expect(res.body).toStrictEqual({
      data: [entities[0], entities[4]].map(item =>
        instanceToPlain(UsersController.userToResponse(item.toJson())),
      ),
      meta: {
        total: 3,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
      },
    })
  })

  it('should return a error with 422 when param fake is provided', async () => {
    await request(app.getHttpServer())
      .get(`/users?fakeParam=null`)
      .set('Authorization', `Bearer ${token}`)
      .expect(422)
      .expect({
        message: ['property fakeParam should not exist'],
        error: 'Unprocessable Entity',
        statusCode: 422
      })
  })
})