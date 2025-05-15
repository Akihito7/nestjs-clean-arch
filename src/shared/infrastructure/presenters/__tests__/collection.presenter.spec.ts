import { instanceToPlain } from "class-transformer";
import { CollectionPresenter } from "../collection.presenter";
import { PaginationPresenter } from "../pagination.presenter"


class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3]
}
describe('collectionPresenter unit tests', () => {

  let SUT: StubCollectionPresenter;

  beforeEach(() => {
    SUT = new StubCollectionPresenter({
      currentPage: 1,
      lastPage: 2,
      perPage: 15,
      total: 30
    });
  })

  describe('constructor', () => {
    it('should set values', () => {
      expect(SUT['paginationPresenterProps']).toBeInstanceOf(PaginationPresenter)
      expect(SUT['paginationPresenterProps'].currentPage).toBe(1)
      expect(SUT['paginationPresenterProps'].perPage).toBe(15)
      expect(SUT['paginationPresenterProps'].lastPage).toBe(2)
      expect(SUT['paginationPresenterProps'].total).toBe(30)
    })

    it('should expose property meta instead paginationPresenter', () => {
      const output = instanceToPlain(SUT)
      expect(output).toStrictEqual({
        data: [1, 2, 3],
        meta: { currentPage: 1, lastPage: 2, perPage: 15, total: 30 }
      })
    })
  })

})