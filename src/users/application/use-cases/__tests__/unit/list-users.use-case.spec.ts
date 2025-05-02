import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { ListUsers } from "../../list-users.use-case"
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository"
import { UserEntity } from "@/users/domain/entities/user.entity"

describe('listUsers useCase tests unit', () => {
  let userRepository: UserInMemoryRepository
  let SUT: ListUsers.UseCase

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    SUT = new ListUsers.UseCase(userRepository)
  })
  it('should return users ordened by createdAt', async () => {
    const users = [
      new UserEntity({
        name: 'Alice',
        email: 'alice@gmail.com',
        password: '123',
        createdAt: new Date('2023-11-15T10:00:00Z')
      }),
      new UserEntity({
        name: 'Bob',
        email: 'bob@gmail.com',
        password: '456',
        createdAt: new Date('2024-02-01T08:30:00Z')
      }),
      new UserEntity({
        name: 'Charlie',
        email: 'charlie@gmail.com',
        password: '789',
        createdAt: new Date('2022-09-20T14:45:00Z')
      }),
      new UserEntity({
        name: 'Diana',
        email: 'diana@gmail.com',
        password: '000',
        createdAt: new Date('2024-12-25T18:00:00Z')
      }),
      new UserEntity({
        name: 'Eve',
        email: 'eve@gmail.com',
        password: '999',
        createdAt: new Date('2023-01-10T22:15:00Z')
      }),
    ];
    userRepository.items = users;
    const params: ListUsers.Input = {
      filter: '',
      page: 1,
      perPage: 15,
    }
    const orderExpected = [
      users[3].toJson(),
      users[1].toJson(),
      users[0].toJson(),
      users[4].toJson(),
      users[2].toJson(),
    ];
    const result = await SUT.execute(params);
    expect(result.items).toStrictEqual(orderExpected);
  })

  it('should return users with filtered by name, sort and pagination', async () => {
    const users = [
      new UserEntity({
        name: 'Marcos',
        email: 'marcos@gmail.com',
        password: '123',
        createdAt: new Date('2024-04-01T08:00:00Z')
      }),
      new UserEntity({
        name: 'Lucas',
        email: 'lucas@gmail.com',
        password: '456',
        createdAt: new Date('2023-12-15T09:30:00Z')
      }),
      new UserEntity({
        name: 'Ana',
        email: 'ana@gmail.com',
        password: '789',
        createdAt: new Date('2024-01-10T15:45:00Z')
      }),
      new UserEntity({
        name: 'Marcio',
        email: 'marcio@gmail.com',
        password: 'abc',
        createdAt: new Date('2023-11-05T17:00:00Z')
      }),
      new UserEntity({
        name: 'Bruna',
        email: 'bruna@gmail.com',
        password: 'def',
        createdAt: new Date('2022-10-21T12:00:00Z')
      }),
      new UserEntity({
        name: 'Felipe',
        email: 'felipe@gmail.com',
        password: 'ghi',
        createdAt: new Date('2024-03-02T11:15:00Z')
      }),
      new UserEntity({
        name: 'Marlene',
        email: 'marlene@gmail.com',
        password: 'jkl',
        createdAt: new Date('2023-05-30T20:45:00Z')
      }),
      new UserEntity({
        name: 'Paulo',
        email: 'paulo@gmail.com',
        password: 'mno',
        createdAt: new Date('2024-05-18T10:10:00Z')
      }),
      new UserEntity({
        name: 'Carla',
        email: 'carla@gmail.com',
        password: 'pqr',
        createdAt: new Date('2023-01-01T13:30:00Z')
      }),
      new UserEntity({
        name: 'João',
        email: 'joao@gmail.com',
        password: 'stu',
        createdAt: new Date('2022-09-09T16:20:00Z')
      }),
    ];

    userRepository.items = users;

    const params: ListUsers.Input = {
      filter: 'mar',
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'ASC'
    };

    const result = await SUT.execute(params);

    const orderExpected = [
      users[3].toJson(),
      users[0].toJson(),
    ];

    expect(result).toStrictEqual({
      items: orderExpected,
      total: 3,
      currentPage: 1,
      perPage: 2,
      sort: 'name',
      filter: 'mar',
    });
  });

})