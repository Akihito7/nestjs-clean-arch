import { BaseEntity } from "@/shared/domain/entities/base-entity";
import { SearchableInMemoryRepository } from "../../searchable-in-memory-repository";


interface StubEntityInterface {
  name: string;
  price: number;
}

class StubEntity extends BaseEntity<StubEntityInterface> { }

class StubClassInMemory extends SearchableInMemoryRepository<StubEntity> {
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }
}

describe('SearchableInMemoryRepository – applyFilter', () => {
  let SUT: StubClassInMemory;
  let items: StubEntity[];
  let spyFilter: jest.SpyInstance;

  describe('Filter method', () => {
    beforeEach(() => {
      SUT = new StubClassInMemory();
      items = [
        new StubEntity({ name: 'test', price: 20 }),
        new StubEntity({ name: 'TEST', price: 30 }),
        new StubEntity({ name: 'fake', price: 40 }),
      ];
      SUT.sortableFields = ['name']
      spyFilter = jest.spyOn(items, 'filter');
    });

    afterEach(() => {
      spyFilter.mockRestore();
    });
    it('should return empty array when no entity matches the filter', async () => {
      const result = await SUT['applyFilter'](items, 'no-match');
      expect(result).toHaveLength(0);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });

    it('should return the original array unchanged when filter is null', async () => {
      const result = await SUT['applyFilter'](items, null);
      expect(result).toBe(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it('should match entities case‑insensitively when filter is uppercase', async () => {
      const result = await SUT['applyFilter'](items, 'TEST');
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });

    it('should match entities case‑insensitively when filter is lowercase', async () => {
      const result = await SUT['applyFilter'](items, 'test');
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });
  })

  describe('ApplySort method', () => {

    beforeEach(() => {
      SUT = new StubClassInMemory();
      items = [
        new StubEntity({ name: 'b', price: 20 }),
        new StubEntity({ name: 'a', price: 30 }),
        new StubEntity({ name: 'c', price: 40 }),
      ];
      SUT.sortableFields = ['name']
    });

    it('Should do not applySort', async () => {
      let result = await SUT['applySort'](items, null, null);
      expect(result).toHaveLength(3);
      expect(result).toStrictEqual(items)

      result = await SUT['applySort'](items, 'price', null)
      expect(result).toHaveLength(3);
      expect(result).toStrictEqual(items)
    });

    it('Should applySort', async () => {
      let result = await SUT['applySort'](items, 'name', 'ASC');
      expect(result).toHaveLength(3);
      expect(result).toStrictEqual([items[1], items[0], items[2]])

      result = await SUT['applySort'](items, 'name', null)
      expect(result).toHaveLength(3);
      expect(result).toStrictEqual([items[2], items[0], items[1]])
    });
  })

});
