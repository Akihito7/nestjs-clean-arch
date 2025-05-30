import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma-repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { ListUsers } from "../../list-users.use-case";


describe('listUser use case integration test', () => {
  let prismaService: PrismaService;
  let userRepository: IUserRepository.Repository;
  let SUT: ListUsers.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTest()
    prismaService = new PrismaService();
    module = await Test.createTestingModule({ imports: [DatabaseModule.forTest(prismaService)] }).compile();
    userRepository = new UserPrismaRepository(prismaService);
  });

  beforeEach(async () => {
    SUT = new ListUsers.UseCase(userRepository);
    await prismaService.user.deleteMany();
  })

  afterAll(async () => {
    await module.close();
  })

  it('should return the users ordered by createdAt', async () => {
    const createdAt = new Date()
    const entities: UserEntity[] = []
    const arrange = Array(3).fill(userDateBuilder({}))
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...element,
          email: `test${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      )
    })
    await prismaService.user.createMany({
      data: entities.map(item => ({ ...item.toJson(), id: item.id!.toString() })),
    })

    const output = await SUT.execute({})

    expect(output).toStrictEqual({
      items: entities.reverse().map(item => item.toJson()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      filter : null,
      sort : null,
    })
  })
})

