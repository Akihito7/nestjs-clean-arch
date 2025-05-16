import { UpdateUser } from "@/users/application/use-cases/update-user.use-case";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDTO implements Omit<UpdateUser.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  name: string;
}