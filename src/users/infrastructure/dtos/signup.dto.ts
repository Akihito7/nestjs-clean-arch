import { SignupUseCase } from "@/users/application/use-cases/signup.use-case";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDTO implements SignupUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
}