import { Exclude, Expose } from "class-transformer";
import { PaginationPresenter } from "./pagination.presenter";

export abstract class CollectionPresenter {

  @Exclude()
  protected paginationPresenterProps: PaginationPresenter;

  constructor(props: PaginationPresenter) {
    this.paginationPresenterProps = new PaginationPresenter(props);
  };

  @Expose()
  get meta() {
    return this.paginationPresenterProps;
  }

  abstract get data()

}