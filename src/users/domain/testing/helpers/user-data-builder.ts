import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

type UserDataBuilderProps = {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
};

export function userDateBuilder(props?: UserDataBuilderProps): UserProps {
  return {
    name: props?.name ?? faker.person.fullName(),
    email: props?.email ?? faker.internet.email(),
    password: props?.password ?? faker.internet.password(),
    createdAt: props?.createdAt ?? new Date(),
  };
}
