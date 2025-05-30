import { UserEntity } from "../entities/user.entity";
import { ISearchableRepository, SearchParams as DefaultSearchParams, SearchResult as DefaultSearchResult } from "@/shared/domain/repositories/searchable.interface";

export namespace IUserRepository {

  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> { }

  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> { }

  export interface Repository
    extends ISearchableRepository
    <
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>;
    emailExists(email: string): Promise<void>
  }
}

