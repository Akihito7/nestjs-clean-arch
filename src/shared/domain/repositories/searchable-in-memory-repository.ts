import { BaseEntity } from "../entities/base-entity";
import { InMemoryRepository } from "./in-memory-repository";
import { ISearchableRepository } from "./searchable.interface";

export abstract class SearchableInMemoryRepository
  <
    E extends BaseEntity,
    SearchInput,
    SearchOutput
  >
  extends InMemoryRepository<E>
  implements ISearchableRepository<E, SearchInput, SearchOutput> {
  search(props: any): Promise<any> {
    throw new Error("method not implemented")
  }
}