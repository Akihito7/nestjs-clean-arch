import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma-repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTest } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-test";
import { Signln } from "../../signln.use-case";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";


describe('Signup use case integration test', () => {
  let prismaService: PrismaService;
  let userRepository: IUserRepository.Repository;
  let hashProvider: IHashProvider;
  let SUT: Signln.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTest()
    prismaService = new PrismaService();
    module = await Test.createTestingModule({ imports: [DatabaseModule.forTest(prismaService)] }).compile();
    userRepository = new UserPrismaRepository(prismaService);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    SUT = new Signln.UseCase(userRepository, hashProvider);
    await prismaService.user.deleteMany();
  })

  afterAll(async () => {
    await module.close();
  })

  it('should create a user successfully', async () => {

    const userEntity = new UserEntity(userDateBuilder({ email: 'a@gmail.com', password: '1234' }));

    await prismaService.user.create({
      data: {
        ...userEntity.toJson(),
        password: await hashProvider.generateHash(userEntity.password),
        id: userEntity.id!.toString()
      }
    });

    const props: Signln.Input = {
      email: 'a@gmail.com',
      password: '1234'
    };

    const result = await SUT.execute(props);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  })


})