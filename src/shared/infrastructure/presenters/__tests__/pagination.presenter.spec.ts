import { instanceToPlain } from "class-transformer";
import { PaginationPresenter, PaginationPresenterProps } from "../pagination.presenter";

describe('PaginationPresenter', () => {
  describe('constructor', () => {
    it('should assign values from numeric input', () => {
      const props: PaginationPresenterProps = {
        currentPage: 1,
        lastPage: 2,
        perPage: 20,
        total: 40
      };

      const sut = new PaginationPresenter(props);

      expect(sut.currentPage).toEqual(props.currentPage);
      expect(sut.lastPage).toEqual(props.lastPage);
      expect(sut.perPage).toEqual(props.perPage);
      expect(sut.total).toEqual(props.total);
    });

    it('should assign values from string input', () => {
      const props = {
        currentPage: '1',
        lastPage: '2',
        perPage: '20',
        total: '40',
      } as unknown as PaginationPresenterProps

      const sut = new PaginationPresenter(props);

      expect(sut.currentPage).toEqual(props.currentPage);
      expect(sut.lastPage).toEqual(props.lastPage);
      expect(sut.perPage).toEqual(props.perPage);
      expect(sut.total).toEqual(props.total);
    });
  });

  describe('serialization with instanceToPlain', () => {
    it('should transform string input values to numbers', () => {
      const props = {
        currentPage: '1',
        lastPage: '2',
        perPage: '20',
        total: '40',
      } as unknown as PaginationPresenterProps

      const sut = new PaginationPresenter(props);
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        lastPage: 2,
        perPage: 20,
        total: 40,
      });
    });

    it('should keep numeric input values as numbers', () => {
      const props: PaginationPresenterProps = {
        currentPage: 1,
        lastPage: 2,
        perPage: 20,
        total: 40
      };

      const sut = new PaginationPresenter(props);
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        lastPage: 2,
        perPage: 20,
        total: 40,
      });
    });
  });
});
