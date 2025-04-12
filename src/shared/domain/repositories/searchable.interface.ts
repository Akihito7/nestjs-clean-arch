import { BaseEntity } from "../entities/base-entity";
import { BaseRepository } from "./base-repository.interface";

export interface ISearchableRepository
  <
    E extends BaseEntity,
    SearchInput,
    SearchOutput
  >
  extends BaseRepository<E> {
  search(props: SearchInput): Promise<SearchOutput>
}