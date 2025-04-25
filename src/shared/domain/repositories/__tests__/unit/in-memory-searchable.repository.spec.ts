import { BaseEntity } from "@/shared/domain/entities/base-entity";
import { SearchableInMemoryRepository } from "../../searchable-in-memory-repository";
import { SearchParams, SearchResult } from "../../searchable.interface";

interface StubEntityInterface {
  name: string;
  price: number;
}

class StubEntity extends BaseEntity<StubEntityInterface> {}

class StubClassInMemory extends SearchableInMemoryRepository<StubEntity> {
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
}

describe('SearchableInMemoryRepository', () => {
  let SUT: StubClassInMemory;
  let items: StubEntity[];
  let spyFilter: jest.SpyInstance;

  describe('applyFilter', () => {
    beforeEach(() => {
      SUT = new StubClassInMemory();
      items = [
        new StubEntity({ name: 'test', price: 20 }),
        new StubEntity({ name: 'TEST', price: 30 }),
        new StubEntity({ name: 'fake', price: 40 }),
      ];
      SUT.sortableFields = ['name'];
      spyFilter = jest.spyOn(items, 'filter');
    });

    afterEach(() => {
      spyFilter.mockRestore();
    });

    it('should return an empty array when no items match the filter', async () => {
      const result = await SUT['applyFilter'](items, 'no-match');
      expect(result).toHaveLength(0);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });

    it('should return the original array when the filter is null', async () => {
      const result = await SUT['applyFilter'](items, null);
      expect(result).toBe(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it('should correctly filter items with a case-insensitive filter (uppercase)', async () => {
      const result = await SUT['applyFilter'](items, 'TEST');
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });

    it('should correctly filter items with a case-insensitive filter (lowercase)', async () => {
      const result = await SUT['applyFilter'](items, 'test');
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('applySort', () => {
    beforeEach(() => {
      SUT = new StubClassInMemory();
      items = [
        new StubEntity({ name: 'b', price: 20 }),
        new StubEntity({ name: 'a', price: 30 }),
        new StubEntity({ name: 'c', price: 40 }),
      ];
      SUT.sortableFields = ['name'];
    });

    it('should not apply sort if the sorting field is invalid or not provided', async () => {
      let result = await SUT['applySort'](items, null, null);
      expect(result).toStrictEqual(items);

      result = await SUT['applySort'](items, 'price', null);
      expect(result).toStrictEqual(items);
    });

    it('should correctly sort items when a valid sorting field is provided', async () => {
      let result = await SUT['applySort'](items, 'name', 'ASC');
      expect(result).toStrictEqual([items[1], items[0], items[2]]);

      result = await SUT['applySort'](items, 'name', null);
      expect(result).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPaginate', () => {
    it('should paginate items correctly', async () => {
      SUT = new StubClassInMemory();
      items = [
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
      ];

      SUT.sortableFields = ['name'];

      let paginated = await SUT['applyPaginate'](items, 1, 2);
      expect(paginated).toStrictEqual([items[0], items[1]]);

      paginated = await SUT['applyPaginate'](items, 2, 2);
      expect(paginated).toStrictEqual([items[2], items[3]]);

      paginated = await SUT['applyPaginate'](items, 3, 2);
      expect(paginated).toStrictEqual([items[4]]);

      paginated = await SUT['applyPaginate'](items, 4, 2);
      expect(paginated).toStrictEqual([]);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      SUT = new StubClassInMemory();
      SUT.sortableFields = ['name'];
    });

    it('should apply pagination only when filter and sort are null', async () => {
      const entity = new StubEntity({ name: 'test', price: 20 });
      const items = Array(16).fill(entity);
      SUT.items = items;

      const result = await SUT.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        })
      );
    });

    it('should correctly apply filter and pagination', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
      ];
      SUT.items = items;
      const params = new SearchParams({ filter: 'test', perPage: 2, page: 1 });

      const result = await SUT.search(params);
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          sort: null,
          sortDir: null,
          filter: 'test',
          currentPage: 1,
          perPage: 2,
        })
      );
    });

    it('should correctly apply sorting and pagination', async () => {
      const items = [
        new StubEntity({ name: 'jane', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
        new StubEntity({ name: 'banana', price: 50 }),
        new StubEntity({ name: 'Maçã', price: 50 }),
        new StubEntity({ name: 'Café', price: 50 }),
        new StubEntity({ name: 'Notebook', price: 50 }),
        new StubEntity({ name: 'Teclado', price: 50 }),
        new StubEntity({ name: 'Monitor', price: 50 }),
      ];
      SUT.items = items;

      let params = new SearchParams({ sort: 'name', sortDir: 'ASC' });
      let result = await SUT.search(params);
      expect(result).toStrictEqual(
        new SearchResult({
          items: await SUT['applySort'](items, 'name', 'ASC'),
          total: 10,
          sort: 'name',
          sortDir: 'ASC',
          filter: null,
          currentPage: 1,
          perPage: 15,
        })
      );

      params = new SearchParams({ sort: 'name' });
      result = await SUT.search(params);
      expect(result).toStrictEqual(
        new SearchResult({
          items: await SUT['applySort'](items, 'name', null),
          total: 10,
          sort: 'name',
          sortDir: 'DESC',
          filter: null,
          currentPage: 1,
          perPage: 15,
        })
      );
    });

    it('should correctly apply filter, sorting, and pagination', async () => {
      const items = [
        new StubEntity({ name: 'Notebook Pro', price: 100 }),
        new StubEntity({ name: 'Notebook Air', price: 90 }),
        new StubEntity({ name: 'Notebook Gamer', price: 120 }),
        new StubEntity({ name: 'Note 10', price: 85 }),
        new StubEntity({ name: 'NotePad', price: 70 }),
        new StubEntity({ name: 'Notebooks', price: 95 }),
        new StubEntity({ name: 'Smartphone', price: 150 }),
        new StubEntity({ name: 'Monitor', price: 110 }),
        new StubEntity({ name: 'Teclado', price: 60 }),
        new StubEntity({ name: 'Mouse', price: 40 }),
      ];
      const params = new SearchParams({
        filter: 'note',
        sort: 'name',
        sortDir: 'ASC',
      });
      SUT.items = items;

      const filtered = await SUT['applyFilter'](items, 'note');
      const sorted = await SUT['applySort'](filtered, 'name', 'ASC');

      const result = await SUT.search(params);
      expect(result).toStrictEqual(
        new SearchResult({
          items: sorted,
          total: 6,
          sort: 'name',
          sortDir: 'ASC',
          filter: 'note',
          currentPage: 1,
          perPage: 15,
        })
      );
    });
  });
});
