import { SignupUseCase } from '@/users/application/use-cases/signup.use-case';
import { SignupDTO } from '../../dtos/signup.dto';
import { UsersController } from '../../users.controller';
import { UUIDTypes } from 'uuid';
import { SignlnDTO } from '../../dtos/signln.dto';
import { UpdateUserDTO } from '../../dtos/update-user.dto';
import { UpdateUserPassword } from '@/users/application/use-cases/update-user-password.use-case';
import { UpdateUserPasswordDTO } from '../../dtos/update-user-password.dto';
import { ListUserDTO } from '../../dtos/list-user.dto';
import { ListUsers } from '@/users/application/use-cases/list-users.use-case';

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


  it('should authenticate user', async () => {

    const input: SignlnDTO = {
      email: 'test@gmail.com',
      password: '1234'
    };

    const mockSignlnUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    };

    SUT['signlnUseCase'] = mockSignlnUseCase as any

    const result = await SUT.signln(input);

    expect(result).toMatchObject(output);
    expect(mockSignlnUseCase.execute).toHaveBeenCalledWith(input);
  })



  it('should update user', async () => {

    const input: UpdateUserDTO = {
      name: 'Jane Doe',
    };

    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    };

    SUT['updateUserUseCase'] = mockUpdateUserUseCase as any

    const result = await SUT.update(id.toString(), input);

    expect(result).toMatchObject(output);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input
    });
  })

  it('should update password user', async () => {

    const input: UpdateUserPasswordDTO = {
      oldPassword: 'old',
      newPassword: 'new'
    };

    const mockUpdateUserPasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    };

    SUT['updateUserPasswordUseCase'] = mockUpdateUserPasswordUseCase as any

    const result = await SUT.updatePassword(id.toString(), input);

    expect(result).toMatchObject(output);
    expect(mockUpdateUserPasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input
    });
  })

  it('Should remove a user', async () => {

    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    };

    SUT['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await SUT.delete(id.toString());

    expect(result).toMatchObject(output);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
  })

  it('Should find one user', async () => {

    const mockGetUserUseCaseUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    };

    SUT['getUserUseCase'] = mockGetUserUseCaseUseCase as any

    const result = await SUT.findOne(id.toString());

    expect(result).toMatchObject(output);
    expect(mockGetUserUseCaseUseCase.execute).toHaveBeenCalledWith({ id });
  })


  it('Should get user list', async () => {

    const outputUserList: ListUsers.Output = {
      items: [output],
      currentPage: 1,
      perPage: 15,
      total: 1,
      filter: '',
      sort: ''
    }

    const input: ListUserDTO = {
      filter: '',
      page: 1,
      perPage: 15,
      sort: '',
      sortDir: 'ASC'
    }
    const mockListUserUseCaseUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(outputUserList))
    };

    SUT['listUserUseCase'] = mockListUserUseCaseUseCase as any

    const result = await SUT.search(input);

    expect(result).toMatchObject(outputUserList);
    expect(mockListUserUseCaseUseCase.execute).toHaveBeenCalledWith(input);
  })


}); 
