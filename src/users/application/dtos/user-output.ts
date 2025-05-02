import { UserEntity } from "@/users/domain/entities/user.entity";

export interface IUserOutput {
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