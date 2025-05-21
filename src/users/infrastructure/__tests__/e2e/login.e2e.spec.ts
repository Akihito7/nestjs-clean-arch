import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UsersModule } from "../../users.module";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import request from "supertest";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { InvalidCredentialsErrorFilter } from "@/shared/infrastructure/exception-filters/invalid-credentials-error.filter";
import { globalMainConfig } from "@/global-main-config";

describe('login e2e tests', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  let prismaClient: PrismaClient = new PrismaClient();
  let repository: IUserRepository.Repository;
  let userEntity: UserEntity;
  let hashProvider: IHashProvider;

  beforeAll(async () => {
    setupPrismaTest()
    appModule = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaClient as any), UsersModule, BcryptjsHashProvider]
    }).compile();

    repository = appModule.get<IUserRepository.Repository>('UserRepository');
    hashProvider = appModule.get<IHashProvider>(BcryptjsHashProvider)

    app = appModule.createNestApplication();

    await globalMainConfig(app)

    app.init();
  });

  beforeEach(async () => {
    const passwordHashed = await hashProvider.generateHash('1234');
    userEntity = new UserEntity(userDateBuilder({ password: passwordHashed }));
    await repository.insert(userEntity);
  })

  it('should return jwt login with successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/signln')
      .send({
        email: userEntity.email,
        password: '1234'
      })
      .expect(200)
    expect(Object.keys(response.body)).toStrictEqual(['acessToken'])
  })


  it('should throw error when password is not correctly', async () => {
    await request(app.getHttpServer())
      .post('/users/signln')
      .send({
        email: userEntity.email,
        password: '1232'
      })
      .expect(401)
      .expect({
        statusCode: 401,
        error: 'InvalidCredentialsError',
        message: 'Invalid credentials'
      })
  })

  it('should throw error when email is not correctly', async () => {
    await request(app.getHttpServer())
      .post('/users/signln')
      .send({
        email: userEntity.email,
        password: '1232'
      })
      .expect(401)
      .expect({
        statusCode: 401,
        error: 'InvalidCredentialsError',
        message: 'Invalid credentials'
      })
  })

  it('should throw error when body is not provided', async () => {
    await request(app.getHttpServer())
      .post('/users/signln')
      .send({}).expect(422).expect({
        message: [
          'email must be an email',
          'email should not be empty',
          'email must be a string',
          'password should not be empty',
          'password must be a string'
        ],
        error: 'Unprocessable Entity',
        statusCode: 422
      })
  })

  it('should throw error when email is not provided', async () => {
    await request(app.getHttpServer())
      .post('/users/signln')
      .send({ password: '1234' }).expect(422).expect({
        message: [
          'email must be an email',
          'email should not be empty',
          'email must be a string',
        ],
        error: 'Unprocessable Entity',
        statusCode: 422
      })
  })


  it('should throw error when email is not provided', async () => {
    await request(app.getHttpServer())
      .post('/users/signln')
      .send({ email: userEntity.email }).expect(422).expect({
        message: [
          'password should not be empty',
          'password must be a string'
        ],
        error: 'Unprocessable Entity',
        statusCode: 422
      })
  })

  it('should return a error with 404 code when email not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/signln')
      .send({ email: 'b@b.com', password: 'fake' })
      .expect(404)
    expect(res.body.error).toBe('NotFoundError')
    expect(res.body.message).toEqual(
      'UserModel not found using email b@b.com',
    )
  })
})