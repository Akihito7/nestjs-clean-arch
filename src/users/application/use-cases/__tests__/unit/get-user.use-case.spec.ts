import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { BcryptjsHashProvider } from "@/users/application/providers/bcryptjs-hash.provider";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { GetUserUseCase } from "../../get-user.use-case";
import { NotFoundError } from "@/shared/errors/not-found-error";

describe("Get user UseCase Unit Tests", () => {
  let userInMemoryRepository: UserInMemoryRepository;
  let hashProvider: BcryptjsHashProvider;
  let SUT: GetUserUseCase.UseCase

  beforeEach(() => {
    userInMemoryRepository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    SUT = new GetUserUseCase.UseCase(userInMemoryRepository);
  });

  it('should throw error when entity not found', async () => {
    const fakeId = 'fakeId';
    await expect(SUT.execute({ id: fakeId })).rejects.toThrow(NotFoundError)
  })

  it('should get information about user by id', async () => {
    const userEntity = new UserEntity(userDateBuilder());
    userInMemoryRepository.items = [userEntity]
    const result = await SUT.execute({ id: userEntity.id! });
    expect(result).toStrictEqual(userEntity.toJson())
  });
});
