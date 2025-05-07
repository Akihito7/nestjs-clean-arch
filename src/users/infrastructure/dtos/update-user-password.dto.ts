import { UpdateUserPassword } from "@/users/application/use-cases/update-user-password.use-case";

export class UpdateUserPasswordDTO implements Omit<UpdateUserPassword.Input, 'id'> {
  newPassword: string;
  oldPassword: string;
}