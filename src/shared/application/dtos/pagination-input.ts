import { SortDirection } from "@/shared/domain/repositories/searchable.interface";

export interface PaginationInput<Filter = string> {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
}