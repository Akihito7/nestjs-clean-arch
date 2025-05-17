import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module";
import { Test, TestingModule } from "@nestjs/testing"
import { UsersModule } from "../../users.module";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaClient } from "@prisma/client";
import request from "supertest"
import { SignupDTO } from "../../dtos/signup.dto";
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { UsersController } from "../../users.controller";
import { instanceToPlain } from "class-transformer";
import { globalMainConfig } from "@/global-main-config";
import { INestApplication } from "@nestjs/common";
import { UserEntity } from "@/users/domain/entities/user.entity";

describe('UsersController (e2e) - POST /users/signup', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  let prismaService: PrismaClient;
  let signupDTO: Partial<SignupDTO>;
  let repository: IUserRepository.Repository

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

  beforeEach(() => {
    signupDTO = {
      name: 'Jane Doe',
      email: 'a@a.com',
      password: '1234'
    };
  })

  afterEach(async () => {
    await prismaService.user.deleteMany()
  })

  it('should create user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDTO)
      .expect(201);

    expect(Object.keys(response.body.data))
      .toStrictEqual(['id', 'name', 'email', 'createdAt']);

    const user = await repository.findById(response.body.data.id);
    const presenter = UsersController.userToResponse(user!.toJson());
    const serialized = instanceToPlain(presenter);


    expect(response.body.data).toStrictEqual(serialized);
  })

  it('should return a error with 422 code when the request body is invalid', async () => {

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send({})
      .expect(422);

    expect(response.body.message).toStrictEqual(([
      'name should not be empty',
      'name must be a string',
      'email must be an email',
      'email should not be empty',
      'email must be a string',
      'password should not be empty',
      'password must be a string'
    ]));
    expect(response.body.error).toStrictEqual('Unprocessable Entity');
  })


  it('should return a error with 422 code when the name field is invalid', async () => {
    delete signupDTO.name
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDTO)
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual([
      'name should not be empty',
      'name must be a string',
    ])
  })

  it('should return a error with 422 code when the email field is invalid', async () => {
    delete signupDTO.email
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDTO)
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual([
      'email must be an email',
      'email should not be empty',
      'email must be a string',
    ])
  })

  it('should return a error with 422 code when the password field is invalid', async () => {
    delete signupDTO.password
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDTO)
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual([
      'password should not be empty',
      'password must be a string',
    ])
  })

  it('should return a error with 422 code with invalid field provided', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(Object.assign(signupDTO, { xpto: 'fake' }))
      .expect(422)
    expect(res.body.error).toBe('Unprocessable Entity')
    expect(res.body.message).toEqual(['property xpto should not exist'])
  })

  it('should return a error with 409 code when email already exists', async () => {
    console.log("its me dto", signupDTO)
    await repository.insert(new UserEntity({ ...signupDTO as any }))
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDTO)
      .expect(409);
    expect(res.body.error).toBe('ConflictError')
    expect(res.body.message).toEqual('Email address already used')
  })

})