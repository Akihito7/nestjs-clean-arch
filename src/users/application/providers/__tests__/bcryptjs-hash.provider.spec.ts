import { IHashProvider } from "@/shared/application/providers/hash.provider";
import { BcryptjsHashProvider } from "../bcryptjs-hash.provider";

describe('Bcryptjs Hash provider unit tests', () => {
  let sut: IHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('should generate a valid hash from a password', async () => {
    const plainPassword = 'admin123';
    
    const hashedPassword = await sut.generateHash(plainPassword);

    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toEqual(plainPassword);
  });

  it('should correctly compare a password with its hash', async () => {
    const plainPassword = 'admin123';
    const hashedPassword = await sut.generateHash(plainPassword);

    const isPasswordValid = await sut.compare(plainPassword, hashedPassword);
    expect(isPasswordValid).toBeTruthy();

    const wrongPassword = 'wrongpassword';
    const isWrongPasswordValid = await sut.compare(wrongPassword, hashedPassword);
    expect(isWrongPasswordValid).toBeFalsy();
  });
});
