import { PaginationInput } from "@/shared/application/dtos/pagination-input";
import { SortDirection } from "@/shared/domain/repositories/searchable.interface";
import { IsOptional } from "class-validator";

export class ListUserDTO implements PaginationInput {

  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  sort?: string

  @IsOptional()
  sortDir?: SortDirection

  @IsOptional()
  filter?: string;
}