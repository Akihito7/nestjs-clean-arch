import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { UserPrismaRepository } from "../../user-prisma-repository";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";

describe('User prisma repository integration tests', () => {

  let prismaClient: PrismaClient;
  let module: TestingModule;
  let SUT: UserPrismaRepository;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test  -- npx prisma migrate deploy');
    prismaClient = new PrismaClient()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaClient as any)]
    }).compile()
  });

  beforeEach(async () => {
    SUT = new UserPrismaRepository(prismaClient as any)
    await prismaClient.user.deleteMany()
  })

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it('Should find user by id', async () => {
    const { id, ...rest } = new UserEntity(userDateBuilder()).toJson()
    await prismaClient.user.create({
      data: {
        id: id!.toString(),
        ...rest
      }
    })
    const user = await SUT.findById(id!.toString());
    expect(user.toJson()).toStrictEqual({ id, ...rest })
  })

  it('should throw error when user is not found', async () => {
    await expect(SUT.findById('fakeId')).rejects.toThrow(new NotFoundError(`User with this id fakeId not found.`));
  })

  it('it should create user', async () => {
    const userEntity = new UserEntity(userDateBuilder())
    await SUT.insert(userEntity);

    const user = await SUT.findById(userEntity.id!.toString());
    expect(user).toBeTruthy();
    expect(user.toJson()).toStrictEqual(userEntity.toJson());
  })

  it('should return all users', async () => {
    const usersEntity = Array.from({ length: 3 }).map(() => new UserEntity(userDateBuilder()))
    await prismaClient.user.createMany({
      data: usersEntity.map(user => ({
        ...user.toJson(),
        id: user.id!.toString(),
      }))
    })
    const users = await SUT.findAll();
    usersEntity.forEach(expected => {
      const found = users.find(received => received.toJson().id === expected.toJson().id);
      expect(found!.toJson()).toStrictEqual(expected.toJson());
    });
    expect(users).toHaveLength(3);
  })
})


// o que queremos testar aqui, e o user repository, mas e um teste de integracao
// entao queremos ter o prisma real aqui, e nao nada mockado