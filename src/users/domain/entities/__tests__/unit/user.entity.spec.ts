import { UserEntity, UserProps } from '../../user.entity';
import { faker } from '@faker-js/faker';

describe('UserEntity Unit Tests', () => {
  let props: UserProps;
  let SUT: UserEntity;
  beforeEach(() => {
    props = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    SUT = new UserEntity(props);
  });
  it('Should create a UserEntity', () => {
    expect(SUT.props.name).toEqual(props.name);
    expect(SUT.props.email).toEqual(props.email);
    expect(SUT.props.password).toEqual(props.password);
    expect(SUT.props.createdAt).toBeInstanceOf(Date);
  });
});
