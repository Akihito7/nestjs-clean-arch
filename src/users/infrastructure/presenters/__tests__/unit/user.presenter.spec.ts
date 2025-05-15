import { IUserOutput } from "@/users/application/dtos/user-output";
import { UserCollectionPresenter, UserPresenter } from "../../user.presenter"
import { instanceToPlain } from "class-transformer";
import { PaginationPresenter } from "@/shared/infrastructure/presenters/pagination.presenter";

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


describe('UserCollectionPresenter unit tests', () => {
  const createdAt = new Date()
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
  }

  describe('constructor', () => {
    it('should set values', () => {
      const SUT = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })
      expect(SUT.meta).toBeInstanceOf(PaginationPresenter)
      expect(SUT.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      )
      expect(SUT.data).toStrictEqual([new UserPresenter(props)])
    })
  })

  it('should presenter data', () => {
    let SUT = new UserCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    })
    let output = instanceToPlain(SUT)
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
          name: 'test name',
          email: 'a@a.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    })

    SUT = new UserCollectionPresenter({
      items: [props],
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '1' as any,
      total: '1' as any,
    })
    output = instanceToPlain(SUT)
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
          name: 'test name',
          email: 'a@a.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    })
  })
})