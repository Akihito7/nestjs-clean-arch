import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { UserPrismaRepository } from "../../user-prisma-repository";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";

import { SearchParams, SearchResult } from "@/shared/domain/repositories/searchable.interface";
import { ConflictError } from "@/shared/errors/conflit-error";

describe('UserPrismaRepository Integration Tests', () => {
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

  it('should successfully find a user by ID', async () => {
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

  it('should throw NotFoundError when user ID does not exist', async () => {
    await expect(SUT.findById('fakeId')).rejects.toThrow(new NotFoundError(`User with this id fakeId not found.`));
  })

  it('should successfully create a new user', async () => {
    const userEntity = new UserEntity(userDateBuilder())
    await SUT.insert(userEntity);

    const user = await SUT.findById(userEntity.id!.toString());
    expect(user).toBeTruthy();
    expect(user.toJson()).toStrictEqual(userEntity.toJson());
  })

  it('should retrieve all users from the database', async () => {
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

  describe('search method tests', () => {
    it('should return users ordered by createdAt in descending order when no search parameters are provided', async () => {
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

    it('should correctly apply filtering, sorting and pagination when searching users', async () => {
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

  it('should successfully update a user', async () => {
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

  it('should successfully delete a user', async () => {
    const userEntity = new UserEntity(userDateBuilder())
    await prismaClient.user.create({
      data: {
        ...userEntity.toJson(),
        id: userEntity.id!.toString(),
      }
    });
    expect(await prismaClient.user.count()).toBe(1);
    await SUT.delete(userEntity.id!);
    expect(await prismaClient.user.count()).toBe(0);
    const user = await prismaClient.user.findUnique({ where: { id: userEntity.id!.toString() } });
    expect(user).toBeNull()
  })

  it('should throw NotFoundError when attempting to delete a non-existent user', async () => {
    await expect(SUT.delete('fakeId')).rejects.toThrow(new NotFoundError('User with this id fakeId not found.'))
  })

  it('should successfully find a user by email', async () => {
    const userEntity = new UserEntity(userDateBuilder());
    await prismaClient.user.create({
      data: {
        ...userEntity.toJson(),
        id: userEntity.id!.toString(),
      }
    });

    const user = await SUT.findByEmail(userEntity.email);
    expect(user).toBeDefined();
    expect(user.toJson()).toStrictEqual(userEntity.toJson())
  })

  it('should throw NotFoundError when searching for a non-existent email', async () => {
    await expect(SUT.findByEmail('a@a.com')).rejects.toThrow(new NotFoundError('UserModel not found usind email a@a.com'))
  });

  it('should throw ConflictError when email already exists', async () => {
    const userEntity = new UserEntity(userDateBuilder());
    await prismaClient.user.create({
      data: {
        ...userEntity.toJson(),
        id: userEntity.id!.toString(),
      }
    });
    await expect(SUT.emailExists(userEntity.email)).rejects.toThrow(new ConflictError(`Email address already used`));
  });

  it('should not throw any error when checking for a non-existent email', async () => {
    await expect(SUT.emailExists("a@a.com")).resolves.not.toThrow();
  })
})