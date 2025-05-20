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
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";

describe('UsersController (e2e) - GET /users/id', () => {
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

    repository = appModule.get<IUserRepository.Repository>('UserRepository')
    hashProvider = new BcryptjsHashProvider();


    app = appModule.createNestApplication();

    await globalMainConfig(app);

    await app.init();
  });

  beforeEach(async () => {
    const hashPassword = await hashProvider.generateHash('old_password')
    entity = new UserEntity(userDateBuilder({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: hashPassword
    }));
    await repository.insert(entity);

    const loginResponse = await request(app.getHttpServer()).post('/users/signln').send({
      email: 'janedoe@gmail.com',
      password: 'old_password'
    });

    token = loginResponse.body.acessToken;
  })


  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  it('should find one user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${entity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const presenter = UsersController.userToResponse(entity.toJson());
    const serialized = instanceToPlain(presenter);
    expect(response.body.data).toStrictEqual(serialized)
  })

  it('should return a error with 404 code when entity is not found', async () => {

    await request(app.getHttpServer())
      .get('/users/fakeId')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(404).expect({
        statusCode: 404,
        error: 'NotFoundError',
        message: 'User with this id fakeId not found.'
      })
  })
})