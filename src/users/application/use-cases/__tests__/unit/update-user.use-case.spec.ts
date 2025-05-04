import { UpdateUser } from "../../update-user.use-case"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { NotFoundError } from "@/shared/errors/not-found-error";

describe('update user use case unit tests', () => {
  let userRepository: UserInMemoryRepository;
  let SUT: UpdateUser.UseCase;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    SUT = new UpdateUser.UseCase(userRepository);
  });

  it('should update the user successfully', async () => {
    const userEntity = new UserEntity(userDateBuilder({ name: 'test' }));
    const input = {
      id: userEntity.id!,
      name: 'otherName'
    };
    userRepository.items = [userEntity];

    const result = await SUT.execute(input);
    expect(result.name).toStrictEqual('otherName');
  });

  it('should throw BadRequestError if name is invalid', async () => {
    const input = {
      id: '' as any,
      name: null as any
    };

    await expect(SUT.execute(input)).rejects.toThrow(BadRequestError);
  });

  it('should throw NotFoundError if user does not exist', async () => {
    const input = {
      id: 'fakeId',
      name: 'otherName'
    };
    await expect(SUT.execute(input)).rejects.toThrow(NotFoundError);
  });
});
