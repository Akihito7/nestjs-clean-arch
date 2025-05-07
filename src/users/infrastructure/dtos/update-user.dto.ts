import { UpdateUser } from "@/users/application/use-cases/update-user.use-case";

export class UpdateUserDTO implements Omit<UpdateUser.Input, 'id'> {
  name: string;
}