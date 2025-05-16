import { UpdateUserPassword } from "@/users/application/use-cases/update-user-password.use-case";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserPasswordDTO implements Omit<UpdateUserPassword.Input, 'id'> {

  @IsString()
  @IsNotEmpty()
  newPassword: string;
  
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}