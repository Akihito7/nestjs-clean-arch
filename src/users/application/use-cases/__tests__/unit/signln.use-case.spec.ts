import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { Signln } from "../../signln.use-case"
import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { InvalidCredentialsError } from "@/shared/errors/invalid-credentials-error";

describe('SignIn Use Case - Unit Tests', () => {
  let userRepository: UserInMemoryRepository;
  let bcryptProvider: IHashProvider;
  let SUT: Signln.UseCase;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    bcryptProvider = new BcryptjsHashProvider();
    SUT = new Signln.UseCase(userRepository, bcryptProvider);
  });

  it('should throw BadRequestError when email is null', async () => {
    const input = {
      email: null as any,
      password: '1234'
    };
    await expect(SUT.execute(input)).rejects.toThrow(new BadRequestError('Input data is not provided.'));
  });

  it('should throw BadRequestError when password is null', async () => {
    const input = {
      email: 'test@email.com',
      password: null as any,
    };
    await expect(SUT.execute(input)).rejects.toThrow(new BadRequestError('Input data is not provided.'));
  });

  it('should throw NotFoundError when user is not found by email', async () => {
    const input = {
      email: 'test@email.com',
      password: '1234'
    };
    await expect(SUT.execute(input)).rejects.toThrow(
      new NotFoundError(`User with this email ${input.email} not found.`)
    );
  });

  it('should throw InvalidCredentialsError when password does not match', async () => {
    const passwordHashed = await bcryptProvider.generateHash('123');
    const userEntity = new UserEntity(userDateBuilder({ email: 'test@email.com', password: passwordHashed }));
    userRepository.items = [userEntity];
    const input = {
      email: 'test@email.com',
      password: '1234'
    };
    await expect(SUT.execute(input)).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should authenticate user successfully with correct credentials', async () => {
    const passwordHashed = await bcryptProvider.generateHash('1234');
    const userEntity = new UserEntity(userDateBuilder({ email: 'test@email.com', password: passwordHashed }));
    userRepository.items = [userEntity];
    const input = {
      email: 'test@email.com',
      password: '1234'
    };
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail');
    const result = await SUT.execute(input);

    expect(result).toBeTruthy();
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(userEntity.toJson());
  });
});
