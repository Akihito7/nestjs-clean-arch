import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserInMemoryRepository } from "../user-in-memory.repository"
import { ConflictError } from "@/shared/errors/conflit-error";
import { NotFoundError } from "@/shared/errors/not-found-error";
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
});
