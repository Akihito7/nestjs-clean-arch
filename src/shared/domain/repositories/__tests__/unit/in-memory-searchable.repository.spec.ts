import { BaseEntity } from "@/shared/domain/entities/base-entity";
import { SearchableInMemoryRepository } from "../../searchable-in-memory-repository";
import { faker, Faker } from "@faker-js/faker/.";


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

  beforeEach(() => {
    SUT = new StubClassInMemory();
    items = [
      new StubEntity({ name: 'test', price: 20 }),
      new StubEntity({ name: 'TEST', price: 30 }),
      new StubEntity({ name: 'fake', price: 40 }),
    ];
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
});
