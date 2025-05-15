import { IUserOutput } from "@/users/application/dtos/user-output";
import { UUIDTypes } from "uuid";
import { Transform, Exclude, Expose } from 'class-transformer'
import { CollectionPresenter } from "@/shared/infrastructure/presenters/collection.presenter";
import { ListUsers } from "@/users/application/use-cases/list-users.use-case";

export class UserPresenter {
  id: UUIDTypes | undefined;

  name: string;

  email: string;

  @Exclude()
  password: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: IUserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.password = output.password;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(props: ListUsers.Output) {
    const { items, ...paginationPresenterProps } = props;
    super(paginationPresenterProps);
    this.data = items.map(user => new UserPresenter(user));
  }

}