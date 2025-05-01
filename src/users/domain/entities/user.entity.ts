import { BaseEntity } from '@/shared/domain/entities/base-entity';
import { EntityValidationError } from '@/shared/errors/validation-error';
import { UserValidatorFactory } from '@/users/validators/user-validator';
import { UUIDTypes } from 'uuid';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserEntity extends BaseEntity<UserProps> {
  constructor(
    _props: UserProps,
    _id?: UUIDTypes,
  ) {
    UserEntity.validateProps(_props)
    super(_props, _id);
    this._props.createdAt = _props.createdAt ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  private set name(name: string) {
    this._props.name = name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  private set password(password: string) {
    this._props.password = password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  update(name: string) {
    UserEntity.validateProps({ ...this._props, name })
    this.name = name;
  }

  updatePassword(password: string) {
    UserEntity.validateProps({ ...this._props, password })
    this._props.password = password;
  }

  static validateProps(userProps: UserProps): void {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(userProps);
    if (!isValid && validator.errors) {
      throw new EntityValidationError(validator.errors)
    }
  }
}

// Removi o 'protected' antes dos parâmetros do construtor porque, ao utilizá-lo, ele cria propriedades diretamente na classe,
// o que fazia com que a propriedade 'id' da classe BaseEntity fosse sobrescrita, resultando em 'undefined'.
// Dessa forma, ao deixar os parâmetros apenas como parâmetros de entrada do construtor, evitamos a criação de uma nova
// propriedade 'id' e garantimos que a classe BaseEntity defina corretamente o valor do 'id'.

