import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma-repository";
import { SignupUseCase } from "../../signup.use-case";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from "node:child_process";


describe('Signup use case integration test', () => {
  let prismaService: PrismaService;
  let userRepository: IUserRepository.Repository;
  let hashProvider: IHashProvider;
  let SUT: SignupUseCase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test  -- npx prisma migrate deploy');
    prismaService = new PrismaService();
    module = await Test.createTestingModule({ imports: [DatabaseModule.forTest(prismaService)] }).compile();
    userRepository = new UserPrismaRepository(prismaService);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    SUT = new SignupUseCase.UseCase(userRepository, hashProvider);
    await prismaService.user.deleteMany();
  })

  afterAll(async () => {
    await module.close();
  })

  it('should create a user succesfuly', async () => {
    const props: SignupUseCase.Input = {
      name: 'Jane Doe',
      email: 'a@gmail.com',
      password: '1234'
    };

    const result = await SUT.execute(props);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  })


})