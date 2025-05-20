import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module";
import { Test, TestingModule } from "@nestjs/testing"
import { UsersModule } from "../../users.module";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaClient } from "@prisma/client";
import request from "supertest"
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { globalMainConfig } from "@/global-main-config";
import { INestApplication } from "@nestjs/common";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UpdateUserPasswordDTO } from "../../dtos/update-user-password.dto";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { InvalidPasswordErrorFilter } from "@/shared/infrastructure/exception-filters/invalid-password-error.filter";

describe('UsersController (e2e) - PUT /users/:id', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  let prismaService: PrismaClient;
  let updatePasswordUserDTO: UpdateUserPasswordDTO | Partial<UpdateUserPasswordDTO>;
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

    app.useGlobalFilters(new InvalidPasswordErrorFilter());

    await globalMainConfig(app);

    await app.init();
  });

  beforeEach(async () => {
    updatePasswordUserDTO = {
      newPassword: 'new_password',
      oldPassword: 'old_password'
    };
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

  it('should updated user password', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${entity.id}`)
      .send(updatePasswordUserDTO)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const userUpdated = await repository.findById(response.body.data.id);
    const checkNewPassword = await hashProvider.compare(
      'new_password',
      userUpdated!.password,
    )
    expect(checkNewPassword).toBeTruthy();
  })

  it('should return a error with 422 code when the request body is invalid', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/fakeId')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual([
      'newPassword should not be empty',
      'newPassword must be a string',
      'oldPassword should not be empty',
      'oldPassword must be a string',
    ])
  });

  it('should return error 400 when old password does not match', async () => {
    updatePasswordUserDTO.oldPassword = 'fakePassword'
    await request(app.getHttpServer())
      .patch(`/users/${entity.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatePasswordUserDTO).expect(400).expect({
        statusCode: 400,
        error: 'InvalidPasswordError',
        message: 'Old password does not match'
      })
  });


  it('should return error 404 when user with id is not found', async () => {
    updatePasswordUserDTO.oldPassword = 'fakePassword'
    const res = await request(app.getHttpServer())
      .patch('/users/fakeId')
      .send(updatePasswordUserDTO).expect(404).expect({
        statusCode: 404,
        error: 'NotFoundError',
        message: 'User with this id fakeId not found.'
      })
      .set('Authorization', `Bearer ${token}`)
  });

  it('should return a error with 422 code when the password field is invalid', async () => {
    delete updatePasswordUserDTO.newPassword
    const res = await request(app.getHttpServer())
      .patch(`/users/${entity.id}`)
      .send(updatePasswordUserDTO)
      .set('Authorization', `Bearer ${token}`)
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual([
      'newPassword should not be empty',
      'newPassword must be a string',
    ])
  });

  it('should return a error with 422 code when the oldPassword field is invalid', async () => {
    delete updatePasswordUserDTO.oldPassword
    const res = await request(app.getHttpServer())
      .patch(`/users/${entity.id}`)
      .send(updatePasswordUserDTO)
      .set('Authorization', `Bearer ${token}`)
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual([
      'oldPassword should not be empty',
      'oldPassword must be a string',
    ])
  })
})