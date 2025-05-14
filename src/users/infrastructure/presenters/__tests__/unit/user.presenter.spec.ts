import { IUserOutput } from "@/users/application/dtos/user-output";
import { UserPresenter } from "../../user.presenter"
import { instanceToPlain } from "class-transformer";

describe('UserPresenter unit tests', () => {
  let SUT: UserPresenter;
  let props: IUserOutput = {
    id: '9aa3fb18-68c2-4e40-8649-a7adabb42f85',
    email: 'a@a.com.br',
    createdAt: new Date(),
    name: 'Jane Doe',
    password: '1234'
  }

  it('constructor method', async () => {
    SUT = new UserPresenter(props);

    expect(SUT.id).toStrictEqual(props.id);
    expect(SUT.name).toStrictEqual(props.name);
    expect(SUT.email).toStrictEqual(props.email);
    expect(SUT.password).toStrictEqual(props.password);
    expect(SUT.createdAt).toStrictEqual(props.createdAt);
  })


  it('should return transformed data', () => {
    SUT = new UserPresenter(props);
    const output = instanceToPlain(SUT)

    expect(output).toStrictEqual({
      id: '9aa3fb18-68c2-4e40-8649-a7adabb42f85',
      name: 'Jane Doe',
      email: 'a@a.com.br',
      createdAt: props.createdAt.toISOString()
    })
  })
})