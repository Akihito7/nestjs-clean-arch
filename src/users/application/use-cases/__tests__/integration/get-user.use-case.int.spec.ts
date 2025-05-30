import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma-repository";
import { SignupUseCase } from "../../signup.use-case";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { DeleteUser } from "../../delete-user.use-case";
import { GetUserUseCase } from "../../get-user.use-case";


describe('getUser use case integration test', () => {
  let prismaService: PrismaService;
  let userRepository: IUserRepository.Repository;
  let SUT: GetUserUseCase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTest()
    prismaService = new PrismaService();
    module = await Test.createTestingModule({ imports: [DatabaseModule.forTest(prismaService)] }).compile();
    userRepository = new UserPrismaRepository(prismaService);
  });

  beforeEach(async () => {
    SUT = new GetUserUseCase.UseCase(userRepository);
    await prismaService.user.deleteMany();
  })

  afterAll(async () => {
    await module.close();
  })

  it('should get a user successfully', async () => {
    const props: SignupUseCase.Input = {
      name: 'Jane Doe',
      email: 'a@gmail.com',
      password: '1234'
    };

    const userEntity = new UserEntity(props);

    await prismaService.user.create({ data: { ...userEntity.toJson(), id: userEntity.id!.toString() } });

    const user = await SUT.execute({ id: userEntity.id!.toString() });

    expect(user).toBeDefined();

    expect(user).toStrictEqual(userEntity.toJson());

  })


})