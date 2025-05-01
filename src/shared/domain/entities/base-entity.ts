import { UUIDTypes, v4 as uuidv4, validate as uuidValidate } from 'uuid';

export abstract class BaseEntity<T = any> {
  constructor(
    protected _props: T,
    protected _id?: UUIDTypes,
  ) {
    if (_id && !uuidValidate(_id)) {
      throw new Error("Invalid UUID");
    }
    this._id = _id ? _id : uuidv4();
    this._props = _props;
  }

  get id() {
    return this._id;
  }
  get props(): T {
    return this._props;
  }

  toJson(): Required<{ id: UUIDTypes | undefined } & T> {
    return {
      id: this._id,
      ...this._props,
    } as Required<{ id: UUIDTypes | undefined } & T>;
  }
}
