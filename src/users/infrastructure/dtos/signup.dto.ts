import { SignupUseCase } from "@/users/application/use-cases/signup.use-case";

export class SignupDTO implements SignupUseCase.Input {
  name: string;
  email: string;
  password: string;
}