import { UUIDTypes, validate as uuidValidate } from "uuid";
import { BaseEntity } from "../../base-entity";

type StubEntityProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends BaseEntity<StubEntityProps> { }

describe("BaseEntity Unit Tests", () => {
  it("should store provided properties correctly", () => {
    const props: StubEntityProps = {
      prop1: "Guilherme",
      prop2: 1234,
    };
    const stub = new StubEntity(props);

    expect(stub.props).toStrictEqual(props);
    expect(stub.props.prop1).toEqual(props.prop1);
    expect(stub.props.prop2).toEqual(props.prop2);
  });

  it("should generate a valid UUID when no ID is provided", () => {
    const props: StubEntityProps = {
      prop1: "Guilherme",
      prop2: 1234,
    };
    const stub = new StubEntity(props);
    expect(stub.id).toBeDefined();
    expect(uuidValidate(stub.id)).toBeTruthy();
  });

  it("should use provided UUID when given", () => {
    const props: StubEntityProps = {
      prop1: "Guilherme",
      prop2: 1234,
    };
    const uuid = "8766a46b-b13d-4363-bebc-6e4cef1ef13f";
    const stub = new StubEntity(props, uuid);

    expect(stub.id).toBeDefined();
    expect(uuidValidate(stub.id)).toBeTruthy();
    expect(stub.id).toEqual(uuid);
  });

  it("should convert an entity to JSON", () => {
    const props: StubEntityProps = {
      prop1: "Guilherme",
      prop2: 1234,
    };
    const uuid = "8766a46b-b13d-4363-bebc-6e4cef1ef13f";
    const stub = new StubEntity(props, uuid);
    expect(stub.toJson()).toStrictEqual({
      id: uuid,
      ...props
    })

  })

  it("should throw an error when an invalid UUID is provided", () => {
    const props: StubEntityProps = {
      prop1: "Guilherme",
      prop2: 1234,
    };
    const invalidUuid = "123" as UUIDTypes;

    expect(() => new StubEntity(props, invalidUuid)).toThrow("Invalid UUID");
  });
});
