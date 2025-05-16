import { Signln } from "@/users/application/use-cases/signln.use-case";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignlnDTO implements Signln.Input {
  
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}