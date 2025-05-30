import { ClassValidatorFields } from "@/shared/domain/validators/class-validator-fields";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { UserProps } from "../domain/entities/user.entity";

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;
  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ name, email, password, createdAt }: UserProps) {
    Object.assign(this, { name, email, password, createdAt })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data) ?? {} as UserProps)
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}

