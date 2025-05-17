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
import { UpdateUserDTO } from "../../dtos/update-user.dto";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe('UsersController (e2e) - PUT /users/:id', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  let prismaService: PrismaClient;
  let updateUserDTO: UpdateUserDTO;
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

  beforeEach(async () => {
    updateUserDTO = {
      name: 'Other name',
    };
    entity = new UserEntity(userDateBuilder());
    await repository.insert(entity);
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  it('should updated user', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${entity.id}`)
      .send(updateUserDTO)
      .expect(200);
    const userUpdated = await repository.findById(entity.id!.toString());
    const presenter = UsersController.userToResponse(userUpdated!.toJson())
    const serialized = instanceToPlain(presenter);
    expect(response.body.data).toStrictEqual(serialized)
  })

  it('should return a error with 422 code when the request body is invalid', async () => {

    const response = await request(app.getHttpServer())
      .put(`/users/${entity.id}`)
      .send({})
      .expect(422);

    expect(response.body.message).toStrictEqual(([
      'name should not be empty',
      'name must be a string',
    ]));
    expect(response.body.error).toStrictEqual('Unprocessable Entity');
  })

  it('should return a error with 404 code when entity is not found', async () => {
    await request(app.getHttpServer())
      .put('/users/fakeId')
      .send(updateUserDTO)
      .expect(404).expect({
        statusCode: 404,
        error: 'NotFoundError',
        message: 'User with this id fakeId not found.'
      })

  })
})