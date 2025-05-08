import { SignupUseCase } from '@/users/application/use-cases/signup.use-case';
import { SignupDTO } from '../../dtos/signup.dto';
import { UsersController } from '../../users.controller';
import { UUIDTypes } from 'uuid';

describe('UsersController unit tests', () => {
  let SUT: UsersController;
  let id: UUIDTypes;
  let output: SignupUseCase.Output;

  beforeEach(async () => {
    SUT = new UsersController();
    id = '8ca39979-630e-4939-afcf-64f1d52d29bb';
    output = {
      id,
      email: 'test@gmail.com',
      name: 'Jane Doe',
      password: '1234',
      createdAt: new Date()
    }

  });

  it('should be defined', () => {
    expect(SUT).toBeDefined();
  });

  it('should create a user', async () => {

    const input: SignupDTO = {
      email: 'test@gmail.com',
      name: 'Jane Doe',
      password: '1234'
    };

    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    };

    SUT['signupUseCase'] = mockSignupUseCase as any

    const result = await SUT.signup(input);

    expect(result).toMatchObject(output);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  })
}); 
