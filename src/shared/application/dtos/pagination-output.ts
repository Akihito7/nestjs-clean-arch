import { BaseEntity } from "@/shared/domain/entities/base-entity";
import { SearchResult } from "@/shared/domain/repositories/searchable.interface";

export interface PaginationOutput<Items = any> {
  items: Items[];
  total: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  filter: string | null
  lastPage: number;
}

export class PaginationOutputMapper {
  static toOutput
    <
      Items,
      Entity extends BaseEntity
    >
    (
      items: Items[],
      searchResult: SearchResult<Entity>
    ): PaginationOutput<Items> {
    return {
      items,
      currentPage: searchResult.currentPage,
      filter: searchResult.filter,
      perPage: searchResult.perPage,
      sort: searchResult.sort,
      total: searchResult.total,
      lastPage: searchResult.lastPage,
    }
  }
}
