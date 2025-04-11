import { BaseEntity } from "@/shared/domain/entities/base-entity";
import { InMemoryRepository } from "../../in-memory-repository";
import { faker } from "@faker-js/faker/.";
import { UUIDTypes } from "uuid";
import { NotFoundError } from "@/shared/errors/not-found-error";

interface StubClassProps {
  name: string;
  price: number
}
class StubClass extends BaseEntity<StubClassProps> { }

class StubInMemoryRepository extends InMemoryRepository<StubClass> { }

describe("InMemoryRepository Unit Tests", () => {
  let SUT: StubInMemoryRepository;

  beforeEach(() => {
    SUT = new StubInMemoryRepository();
  });

  it('should insert a new item into the repository', async () => {
    expect(SUT.items).toHaveLength(0);
    const item = new StubClass({ name: 'Jane Doe', price: 20 });
    await SUT.insert(item);
    expect(SUT.items).toHaveLength(1);
    expect(SUT.items[0]).toStrictEqual(item);
  });

  it('should return an item by its ID', async () => {
    const items = makeStub(true, 3);
    SUT.items = items;
    const target = items[items.length - 1];
    const result = await SUT.findById(String(target.id));
    expect(result).toBeTruthy();
    expect(result).toStrictEqual(target);
  });

  it('should return null if item is not found by ID', async () => {
    const result = await SUT.findById('fake-id');
    expect(result).toStrictEqual(null);
  });

  it('should return all items in the repository', async () => {
    SUT.items = makeStub(true, 4);
    const items = await SUT.findAll();
    expect(items).toHaveLength(4);
  });

  it('should return an empty array if no items exist', async () => {
    const items = await SUT.findAll();
    expect(Array.isArray(items)).toBeTruthy();
    expect(items).toHaveLength(0);
  });

  it('should update an existing item by ID', () => {
    const item = makeStub(false);
    SUT.items.push(item);
    const updated = new StubClass({ name: 'Other name', price: 777 }, item.id);
    SUT.update(updated);
    expect(SUT.items[0]).toStrictEqual(updated);
    expect(SUT.items).toHaveLength(1);
    expect(SUT.items[0].id).toBe(item.id);
  });

  it('should throw NotFoundError when updating a non-existent item', async () => {
    await expect(SUT.update(makeStub(false)))
      .rejects.toThrow(new NotFoundError('Entity Not Found'));
  });

  it('should delete an existing item by ID', () => {
    const items = makeStub(true, 3);
    SUT.items = items;
    SUT.delete(items[0].id as UUIDTypes);
    expect(SUT.items).toHaveLength(2);
    const exists = SUT.items.find(item => item.id === items[0].id);
    expect(exists).toBeFalsy();
  });

  it('should throw NotFoundError when deleting a non-existent item', async () => {
    await expect(SUT.delete('fake-id'))
      .rejects.toThrow(new NotFoundError('Entity Not Found'));
  });
});


export function makeStub(isMultiple: true, quantity?: number): StubClass[];
export function makeStub(isMultiple: false, quantity?: number): StubClass;
export function makeStub(isMultiple: boolean, quantity: number): StubClass | StubClass[] {
  if (isMultiple) {
    const maxLength = quantity ?? Math.floor(Math.random() * (10 - 2 + 1)) + 2;
    const items: StubClass[] = [];
    for (let i = 0; i < maxLength; i++) {
      items.push(new StubClass({
        name: faker.person.fullName(),
        price: faker.number.float({ min: 1, max: 100 }),
      }))
    }
    return items;
  }
  return new StubClass({
    name: faker.person.fullName(),
    price: faker.number.float({ min: 1, max: 100 }),
  })
}

