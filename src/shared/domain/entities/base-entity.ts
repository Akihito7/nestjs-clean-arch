import { UUIDTypes, v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity<T> {
  constructor(
    protected readonly props: T,
    protected readonly _id?: UUIDTypes,
  ) {
    this._id = this.id ?? uuidv4();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  toJson(): Required<{ id: UUIDTypes | undefined } & T> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: UUIDTypes | undefined } & T>;
  }
}
