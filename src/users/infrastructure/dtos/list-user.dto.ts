import { PaginationInput } from "@/shared/application/dtos/pagination-input";
import { SortDirection } from "@/shared/domain/repositories/searchable.interface";

export class ListUserDTO implements PaginationInput {
  page?: number;
  perPage?: number;
  sort?: string
  sortDir?: SortDirection
  filter?: string;
}