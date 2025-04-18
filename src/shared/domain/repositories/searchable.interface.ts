import { BaseEntity } from "../entities/base-entity";
import { BaseRepository } from "./base-repository.interface";


type SortDirection = 'ASC' | 'DESC'

interface SearchParamsProps<Filter = string> {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
}

export class SearchParams {
  protected _page: number
  protected _perPage: number
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: string | null

  constructor(props: SearchParamsProps = {}) {
    this.page = props.page ?? 1
    this.perPage = props.perPage ?? 15
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }


  get page(): number {
    return this._page;
  }

  private set page(value: number) {
    const _page = Number(value);
    this._page = Number.isInteger(_page) && _page > 0 ? _page : 1
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = value ? `${value}` : null
  }

  get sortDir(): SortDirection | null {
    return this._sortDir
  }

  private set sortDir(value: SortDirection | null) {
    if (!this._sort) {
      this._sortDir = null;
      return
    }
    const dir = `${value}`.toLocaleUpperCase()
    this._sortDir = dir !== 'ASC' && dir !== 'DESC' ? 'DESC' : dir
  }

  get filter() {
    return this._filter;
  }

  private set filter(value: string | null) {
    this._filter = value ? `${value}` : null
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    const _perPage = typeof value === 'boolean' ? 15 : Number(value);
    this._perPage = Number.isInteger(_perPage) && _perPage > 0 ? _perPage : 15
  }
}


export interface ISearchableRepository
  <
    E extends BaseEntity,
    Params,
    SearchOutput
  >
  extends BaseRepository<E> {
  search(props: Params): Promise<SearchOutput>
}