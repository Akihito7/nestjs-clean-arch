import { SearchParams, SearchResult } from "@/shared/domain/repositories/searchable.interface";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface"
import { PaginationOutputMapper } from "../../pagination-output";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe('MapperPaginateOutput', () => {
  it('should map paginated search result to output DTO', () => {
    const items = [
      new UserEntity(userDateBuilder()),
      new UserEntity(userDateBuilder()),
      new UserEntity(userDateBuilder()),
    ]

    const searchResult = new SearchResult({
      currentPage: 1,
      filter: '',
      items: items,
      perPage: 15,
      sort: 'name',
      sortDir: 'ASC',
      total: 3
    })
    const result = PaginationOutputMapper.toOutput(items, searchResult);
    expect(result).toStrictEqual({
      items,
      total: 3,
      currentPage: 1,
      perPage: 15,
      sort: 'name',
      filter: '',
    })

  })
})