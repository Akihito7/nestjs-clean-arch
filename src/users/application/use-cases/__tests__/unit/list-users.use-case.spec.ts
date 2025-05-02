import { ListUsers } from "../../list-users.use-case";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { SearchResult } from "@/shared/domain/repositories/searchable.interface";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe('ListUsers UseCase - Unit', () => {
  let userRepository: UserInMemoryRepository;
  let SUT: ListUsers.UseCase;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    SUT = new ListUsers.UseCase(userRepository);
  });

  it('should map SearchResult to output format', async () => {
    const users = [
      new UserEntity(userDateBuilder({ name: 'User A' })),
      new UserEntity(userDateBuilder({ name: 'User B' }))
    ];

    const searchResult = new SearchResult<UserEntity>({
      items: users,
      currentPage: 1,
      filter: null,
      perPage: 2,
      sort: null,
      sortDir: null,
      total: 2
    });

    const result = SUT['toOutput'](searchResult);

    expect(result).toStrictEqual({
      items: users.map(u => u.toJson()),
      currentPage: 1,
      filter: null,
      perPage: 2,
      sort: null,
      total: 2
    });
  });

  it('should return users ordered by createdAt descending by default', async () => {
    const users = [
      new UserEntity({ name: 'Older', email: 'old@mail.com', password: '123', createdAt: new Date('2022-01-01') }),
      new UserEntity({ name: 'Newest', email: 'new@mail.com', password: '456', createdAt: new Date('2024-01-01') }),
      new UserEntity({ name: 'Middle', email: 'mid@mail.com', password: '789', createdAt: new Date('2023-01-01') }),
    ];
    userRepository.items = users;

    const result = await SUT.execute({ page: 1, perPage: 10 });

    const expected = [
      users[1].toJson(),
      users[2].toJson(), 
      users[0].toJson(),
    ];

    expect(result.items).toStrictEqual(expected);
  });

  it('should apply filtering, sorting and pagination', async () => {
    const users = [
      new UserEntity({ name: 'Marcos', email: 'marcos@gmail.com', password: '123', createdAt: new Date() }),
      new UserEntity({ name: 'Marcio', email: 'marcio@gmail.com', password: '456', createdAt: new Date() }),
      new UserEntity({ name: 'Lucas', email: 'lucas@gmail.com', password: '789', createdAt: new Date() }),
    ];
    userRepository.items = users;

    const params: ListUsers.Input = {
      filter: 'mar',
      page: 1,
      perPage: 1,
      sort: 'name',
      sortDir: 'ASC',
    };

    const result = await SUT.execute(params);

    expect(result).toStrictEqual({
      items: [users[1].toJson()],
      total: 2,
      currentPage: 1,
      perPage: 1,
      sort: 'name',
      filter: 'mar',
    });
  });
});
