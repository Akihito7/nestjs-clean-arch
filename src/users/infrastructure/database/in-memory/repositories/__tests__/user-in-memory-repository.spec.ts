import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserInMemoryRepository } from "../user-in-memory.repository"
import { ConflictError } from "@/shared/errors/conflit-error";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
describe("User In-Memory Repository Unit Tests", () => {

  let SUT: UserInMemoryRepository;

  beforeEach(() => {
    SUT = new UserInMemoryRepository();
  });

  it('Should return the user when searching by a valid email', async () => {
    const user = new UserEntity({ email: 'test@gmail.com', name: "Jane Doe", password: 'admin123' });
    SUT.items = [user];
    const result = await SUT.findByEmail('test@gmail.com');
    expect(result).toBeTruthy();
    expect(result.email).toStrictEqual('test@gmail.com');
  });

  it("Should throw a ConflictError when searching by an email that does not exist", async () => {
    const user = new UserEntity({ email: 'test@gmail.com', name: "Jane Doe", password: 'admin123' });
    SUT.items = [user];
    await expect(SUT.findByEmail('wrong@gmail.com')).rejects.toThrow(ConflictError);
  });

  it("Should not throw any error when checking for an email that does not exist", async () => {
    const user = new UserEntity({ email: 'test@gmail.com', name: "Jane Doe", password: 'admin123' });
    SUT.items = [user];
    await expect(SUT.emailExists('test2@gmail.com')).resolves.not.toThrow(ConflictError);
  });

  it("Should throw a NotFoundError when checking for an existing email", async () => {
    const user = new UserEntity({ email: 'test@gmail.com', name: "Jane Doe", password: 'admin123' });
    SUT.items = [user];
    await expect(SUT.emailExists('test@gmail.com')).rejects.toThrow(NotFoundError);
  });


  it('Should filter users by name', async () => {
    const users = [
      new UserEntity({ email: '1@gmail.com', name: 'jane', password: 'admin123' }),
      new UserEntity({ email: '1@gmail.com', name: 'joe', password: 'admin123' }),
      new UserEntity({ email: '1@gmail.com', name: 'janisse', password: 'admin123' })
    ]
    SUT.items = users;
    const spyFilter = jest.spyOn(users, 'filter')
    const result = await SUT['applyFilter'](users, 'jan');
    expect(result).toStrictEqual([users[0], users[2]])
    expect(spyFilter).toHaveBeenCalled()
  })
  it('Should filter users by name substring match', async () => {
    const users = [
      new UserEntity({ email: '1@gmail.com', name: 'jane', password: 'admin123' }),
      new UserEntity({ email: '1@gmail.com', name: 'joe', password: 'admin123' }),
      new UserEntity({ email: '1@gmail.com', name: 'janisse', password: 'admin123' })
    ];
    SUT.items = users;
    const spyFilter = jest.spyOn(users, 'filter');
    const result = await SUT['applyFilter'](users, 'jan');
    expect(result).toStrictEqual([users[0], users[2]]);
    expect(spyFilter).toHaveBeenCalled();
  });

  it('Should not filter users when no match found', async () => {
    const users = [
      new UserEntity({ email: '1@gmail.com', name: 'jane', password: 'admin123' }),
      new UserEntity({ email: '1@gmail.com', name: 'joe', password: 'admin123' }),
      new UserEntity({ email: '1@gmail.com', name: 'janisse', password: 'admin123' })
    ];
    SUT.items = users;
    const spyFilter = jest.spyOn(users, 'filter');
    const result = await SUT['applyFilter'](users, 'test');
    expect(result).toHaveLength(0);
    expect(spyFilter).toHaveBeenCalled();
  });

  it('Should apply default sorting by createdAt in descending order', async () => {
    const createdAt = new Date();
    const users = [
      new UserEntity(userDateBuilder({ name: 'Test', createdAt })),
      new UserEntity(userDateBuilder({ name: 'TEST', createdAt: new Date(createdAt.getTime() + 1) })),
      new UserEntity(userDateBuilder({ name: 'fake', createdAt: new Date(createdAt.getTime() + 2) }))
    ];
    SUT.items = users;
    let result = await SUT['applySort'](users, null, null);
    expect(result).toStrictEqual([users[2], users[1], users[0]]);
    result = await SUT['applySort'](users, 'createdAt', 'ASC');
    expect(result).toStrictEqual([users[0], users[1], users[2]]);
  });

  it('Should sort users by name in ascending and descending order', async () => {
    const now = new Date();
    const users = [
      new UserEntity(userDateBuilder({ name: 'b', createdAt: new Date(now.getTime() - 1000000) })),
      new UserEntity(userDateBuilder({ name: 'c', createdAt: new Date(now.getTime() - 500000) })),
      new UserEntity(userDateBuilder({ name: 'a', createdAt: now }))
    ];
    SUT.items = users;
    let result = await SUT['applySort'](users, 'name', 'ASC');
    expect(result).toStrictEqual([users[2], users[0], users[1]]);
    result = await SUT['applySort'](users, 'name', 'DESC');
    expect(result).toStrictEqual([users[1], users[0], users[2]]);
  });
});
