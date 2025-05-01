import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { SignupUseCase } from "../../signup.use-case";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { UserEntity } from "@/users/domain/entities/user.entity";

describe("Signup Use Case Unit Tests", () => {
  let userInMemoryRepository: UserInMemoryRepository;
  let hashProvider: BcryptjsHashProvider;
  let SUT: SignupUseCase.UseCase;

  beforeEach(() => {
    userInMemoryRepository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    SUT = new SignupUseCase.UseCase(userInMemoryRepository, hashProvider);
  });

  it('should successfully create a user and return the user data', async () => {
    const userProps = userDateBuilder();
    const insertMethodSpy = jest.spyOn(userInMemoryRepository, 'insert');
    const result = await SUT.execute(userProps);

    expect(insertMethodSpy).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should throw an error when the email already exists', async () => {
    userInMemoryRepository.items = [new UserEntity({ ...userDateBuilder(), email: 'test@admin.com' })];
    const userProps = { ...userDateBuilder(), email: 'test@admin.com' };

    await expect(SUT.execute(userProps)).rejects.toThrow('Email test@admin.com exists.');
  });

  it('should throw an error when required input data is missing', async () => {
    const userProps = {} as any;
    await expect(SUT.execute(userProps)).rejects.toThrow('Input data is not provided.');
  });
});
