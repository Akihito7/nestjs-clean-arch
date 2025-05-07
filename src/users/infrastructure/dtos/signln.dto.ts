import { Signln } from "@/users/application/use-cases/signln.use-case";

export class SignlnDTO implements Signln.Input {
  email: string;
  password: string;
}