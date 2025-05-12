import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma-repository";
import { SignupUseCase } from "../../signup.use-case";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UpdateUser } from "../../update-user.use-case";
import { UpdateUserPassword } from "../../update-user-password.use-case";
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";


describe('updateUserPassword useCase integration test', () => {
  let prismaService: PrismaService;
  let userRepository: IUserRepository.Repository;
  let hashProvider: IHashProvider;
  let SUT: UpdateUserPassword.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTest()
    prismaService = new PrismaService();
    module = await Test.createTestingModule({ imports: [DatabaseModule.forTest(prismaService)] }).compile();
    userRepository = new UserPrismaRepository(prismaService);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    SUT = new UpdateUserPassword.UseCase(userRepository, hashProvider);
    await prismaService.user.deleteMany();
  })

  afterAll(async () => {
    await module.close();
  })

  it('should update a user successfully', async () => {
    const props: SignupUseCase.Input = {
      name: 'Jane Doe',
      email: 'a@gmail.com',
      password: '1234'
    };

    const userEntity = new UserEntity(props);

    await prismaService.user.create({
      data: {
        ...userEntity.toJson(),
        id: userEntity.id!.toString(),
        password: await hashProvider.generateHash(userEntity.password)
      }
    });

    const result = await SUT.execute({ oldPassword: '1234', newPassword: 'otherPassword', id: userEntity.id!.toString() });

    expect(await hashProvider.compare('otherPassword', result.password)).toBeTruthy();

  })


})