import { BaseEntity } from '@/shared/domain/entities/base-entity';
import { UUIDTypes } from 'uuid';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserEntity extends BaseEntity<UserProps> {
  constructor(
    protected readonly props: UserProps,
    protected readonly _id?: UUIDTypes,
  ) {
    super(props, _id);
    this.props.createdAt = props.createdAt ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
