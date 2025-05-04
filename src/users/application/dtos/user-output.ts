import { UserEntity } from "@/users/domain/entities/user.entity";
import { UUIDTypes } from "uuid";

export interface IUserOutput {
  id: UUIDTypes | undefined;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class UserOutputMapper {
  static toOutput(user: UserEntity): IUserOutput {
    return user.toJson()
  }
}