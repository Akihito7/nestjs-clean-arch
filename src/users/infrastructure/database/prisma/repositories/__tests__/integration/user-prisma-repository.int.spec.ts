import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { UserPrismaRepository } from "../../user-prisma-repository";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";

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
    prismaClient.user.deleteMany()
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
})


// o que queremos testar aqui, e o user repository, mas e um teste de integracao
// entao queremos ter o prisma real aqui, e nao nada mockado