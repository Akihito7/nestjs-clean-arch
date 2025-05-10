import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { UserPrismaRepository } from "../../user-prisma-repository";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";

import { SearchParams, SearchResult } from "@/shared/domain/repositories/searchable.interface";

describe('User prisma repository integration tests', () => {

  let prismaClient: PrismaClient;
  let module: TestingModule;
  let SUT: UserPrismaRepository;

  beforeAll(async () => {
    execSync('npx dotenv-cli -e .env.test  -- npx prisma migrate deploy');
    prismaClient = new PrismaClient()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaClient as any)]
    }).compile()
  });

  beforeEach(async () => {
    SUT = new UserPrismaRepository(prismaClient as any)
    await prismaClient.user.deleteMany()
  })

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it('Should find user by id', async () => {
    const { id, ...rest } = new UserEntity(userDateBuilder()).toJson()
    await prismaClient.user.create({
      data: {
        ...rest,
        id: id!.toString(),
      }
    })
    const user = await SUT.findById(id!.toString());
    expect(user.toJson()).toStrictEqual({ id, ...rest })
  })

  it('should throw error when user is not found', async () => {
    await expect(SUT.findById('fakeId')).rejects.toThrow(new NotFoundError(`User with this id fakeId not found.`));
  })

  it('it should create user', async () => {
    const userEntity = new UserEntity(userDateBuilder())
    await SUT.insert(userEntity);

    const user = await SUT.findById(userEntity.id!.toString());
    expect(user).toBeTruthy();
    expect(user.toJson()).toStrictEqual(userEntity.toJson());
  })

  it('should return all users', async () => {
    const usersEntity = Array.from({ length: 3 }).map(() => new UserEntity(userDateBuilder()))
    await prismaClient.user.createMany({
      data: usersEntity.map(user => ({
        ...user.toJson(),
        id: user.id!.toString(),
      }))
    })
    const users = await SUT.findAll();
    usersEntity.forEach(expected => {
      const found = users.find(received => received.toJson().id === expected.toJson().id);
      expect(found!.toJson()).toStrictEqual(expected.toJson());
    });
    expect(users).toHaveLength(3);
  })

  describe('test method search', () => {


    it('should return a list ordered by createdAt in descending order when no params are provided', async () => {

      const now = new Date();

      const usersEntity = Array.from({ length: 21 }).map((_, index) => {
        const createdAt = new Date(now);
        createdAt.setMinutes(now.getMinutes() + index);
        return new UserEntity({
          ...userDateBuilder(),
          name: `user${index}`,
          createdAt,
        });
      });

      await prismaClient.user.createMany(
        {
          data: usersEntity
            .map(userEntity =>
              ({ ...userEntity.toJson(), id: userEntity.id!.toString() })
            )
        });

      const searchParams = new SearchParams({});

      const result = await SUT.search(searchParams);

      expect(result).toBeInstanceOf(SearchResult);

      expect(result.total).toBe(21);
      for (let i = 0; i < result.items.length - 1; i++) {
        const currentDate = result.items[i].createdAt;
        const nextDate = result.items[i + 1].createdAt;
        expect(currentDate!.getTime()).toBeGreaterThanOrEqual(nextDate!.getTime());
      }

      result.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })

      expect(result.items.length).toBe(15)
    });

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...userDateBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaClient.user.createMany({
        data: entities.map(item => ({
          ...item.toJson(),
          id: item.id!.toString()
        })),
      })

      const searchOutputPage1 = await SUT.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'ASC',
          filter: 'TEST',
        }),
      )
      expect(searchOutputPage1.items[0].toJson()).toMatchObject(
        entities[0].toJson(),
      )
      expect(searchOutputPage1.items[1].toJson()).toMatchObject(
        entities[4].toJson(),
      )

      const searchOutputPage2 = await SUT.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'ASC',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage2.items[0].toJson()).toMatchObject(
        entities[2].toJson(),
      )
    })

  })

  it('should update user', async () => {
    const userEntity = new UserEntity(userDateBuilder({ name: 'fakeName' }))
    await prismaClient.user.create({
      data: {
        ...userEntity.toJson(),
        id: userEntity.id!.toString(),
      }
    })
    expect(userEntity.name).toStrictEqual('fakeName');
    userEntity.update('otherName')
    await SUT.update(userEntity);
    const userUpdated = await prismaClient.user.findUnique({ where: { id: userEntity.id!.toString() } })
    expect(userUpdated!.name).toStrictEqual('otherName');
  })
})




// o que queremos testar aqui, e o user repository, mas e um teste de integracao
// entao queremos ter o prisma real aqui, e nao nada mockado