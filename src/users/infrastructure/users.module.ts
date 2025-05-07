import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { BcryptjsHashProvider } from '../application/providers/bcryptjs-hash.provider';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { SignupUseCase } from '../application/use-cases/signup.use-case';
import { IUserRepository } from '../domain/repositories/user.repository-interface';
import { IHashProvider } from '@/shared/application/providers/hash.provider';
import { Signln } from '../application/use-cases/signln.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUsers } from '../application/use-cases/list-users.use-case';
import { UpdateUser } from '../application/use-cases/update-user.use-case';
import { UpdateUserPassword } from '../application/use-cases/update-user-password.use-case';
import { DeleteUser } from '../application/use-cases/delete-user.use-case';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider
    },
    {
      provide: SignupUseCase.UseCase,
      useFactory: (userRepository: IUserRepository.Repository, hashProvider: IHashProvider) => {
        return new SignupUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider']
    },
    {
      provide: Signln.UseCase,
      useFactory: (userRepository: IUserRepository.Repository, hashProvider: IHashProvider) => {
        return new Signln.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider']
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository']
    },
    {
      provide: ListUsers.UseCase,
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new ListUsers.UseCase(userRepository)
      },
      inject: ['UserRepository']
    },
    {
      provide: UpdateUser.UseCase,
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new UpdateUser.UseCase(userRepository)
      },
      inject: ['UserRepository']
    },
    {
      provide: UpdateUserPassword.UseCase,
      useFactory: (userRepository: IUserRepository.Repository, hashProvider: IHashProvider) => {
        return new UpdateUserPassword.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider']
    },
    {
      provide: DeleteUser.UseCase,
      useFactory: (userRepository: IUserRepository.Repository) => {
        return new DeleteUser.UseCase(userRepository)
      },
      inject: ['UserRepository']
    },
  ],
})
export class UsersModule { }
