import { IUserOutput } from "@/users/application/dtos/user-output";
import { UUIDTypes } from "uuid";
import { Transform, Exclude } from 'class-transformer'

export class UserPresenter {
  id: UUIDTypes | undefined;

  name: string;
  
  email: string;

  @Exclude()
  password: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: IUserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.password = output.password;
    this.createdAt = output.createdAt;
  }
}