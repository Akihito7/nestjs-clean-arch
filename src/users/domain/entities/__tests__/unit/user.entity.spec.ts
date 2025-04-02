import { userDateBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';
import { faker } from '@faker-js/faker';

describe('UserEntity Unit Tests', () => {
  let props: UserProps;
  let SUT: UserEntity;
  beforeEach(() => {
    props = userDateBuilder();
    SUT = new UserEntity(props);
  });
  
  it('Should create a UserEntity', () => {
    expect(SUT.name).toEqual(props.name);
    expect(SUT.email).toEqual(props.email);
    expect(SUT.password).toEqual(props.password);
    expect(SUT.createdAt).toBeInstanceOf(Date);
  });
  it('Should get name of UserEntity', () => {
    expect(SUT.name).toBeDefined();
    expect(SUT.name).toEqual(props.name);
    expect(typeof SUT.name).toBe('string');
  });
  it('Should get email of UserEntity', () => {
    expect(SUT.email).toBeDefined();
    expect(SUT.email).toEqual(props.email);
    expect(typeof SUT.email).toBe('string');
  });
  it('Should get password of UserEntity', () => {
    expect(SUT.password).toBeDefined();
    expect(SUT.password).toEqual(props.password);
    expect(typeof SUT.password).toBe('string');
  });
  it('Should get createdAt of UserEntity', () => {
    expect(SUT.createdAt).toBeDefined();
    expect(SUT.createdAt).toBeInstanceOf(Date);
  });
});
