import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { DeleteUser } from "../../delete-user.use-case"
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { NotFoundError } from "@/shared/errors/not-found-error";

describe('delete user use case unit tests', () => {
  let userRepository: UserInMemoryRepository;
  let SUT: DeleteUser.UseCase;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    SUT = new DeleteUser.UseCase(userRepository);
  });

  it('should delete the user successfully', async () => {
    const userEntity = new UserEntity(userDateBuilder({ name: 'test' }));
    userRepository.items = [userEntity];
    const spyMethodDelete = jest.spyOn(userRepository, 'delete');

    expect(userRepository.items).toHaveLength(1);

    await SUT.execute({ id: userEntity.id! });

    expect(spyMethodDelete).toHaveBeenCalledTimes(1);
    expect(userRepository.items).toHaveLength(0);
  });

  it('should throw NotFoundError when user does not exist', async () => {
    await expect(SUT.execute({ id: 'fakeId' })).rejects.toThrow(new NotFoundError('Entity Not Found'));
  });

  it('should throw NotFoundError when id is null', async () => {
    await expect(SUT.execute({ id: null as any })).rejects.toThrow(new NotFoundError('Id is not provided'));
  });
});
