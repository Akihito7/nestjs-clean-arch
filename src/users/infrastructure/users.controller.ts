import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { SignupUseCase } from '../application/use-cases/signup.use-case';
import { SignupDTO } from './dtos/signup.dto';
import { Signln } from '../application/use-cases/signln.use-case';
import { SignlnDTO } from './dtos/signln.dto';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { UUIDTypes } from 'uuid';
import { ListUserDTO } from './dtos/list-user.dto';
import { ListUsers } from '../application/use-cases/list-users.use-case';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UpdateUser } from '../application/use-cases/update-user.use-case';
import { UpdateUserPassword } from '../application/use-cases/update-user-password.use-case';
import { UpdateUserPasswordDTO } from './dtos/update-user-password.dto';
import { DeleteUser } from '../application/use-cases/delete-user.use-case';

@Controller('users')
export class UsersController {

  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(Signln.UseCase)
  private signlnUseCase: Signln.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(ListUsers.UseCase)
  private listUserUseCase: ListUsers.UseCase;

  @Inject(UpdateUser.UseCase)
  private updateUserUseCase: UpdateUser.UseCase;

  @Inject(UpdateUserPassword.UseCase)
  private updateUserPasswordUseCase: UpdateUserPassword.UseCase

  @Inject(DeleteUser.UseCase)
  private deleteUserUseCase: DeleteUser.UseCase


  @HttpCode(204)
  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return this.signupUseCase.execute(signupDTO)
  }

  @HttpCode(200)
  @Post('signln')
  async signln(@Body() signlnDTO: SignlnDTO) {
    return this.signlnUseCase.execute(signlnDTO)
  }

  @Get("/:id")
  async findOne(@Param("id") userId: string) {
    return this.getUserUseCase.execute({ id: userId })
  }

  @Get()
  async search(@Query() searchableDTO: ListUserDTO) {
    return this.listUserUseCase.execute(searchableDTO)
  }

  @Put("/:id")
  async update(
    @Param("id") userId: string,
    @Body() updateUserDTO: UpdateUserDTO
  ) {
    return this.updateUserUseCase.execute({ id: userId, ...updateUserDTO })
  }

  @Patch("/:id")
  async updatePassword(
    @Param("id") userId: string,
    @Body() updateUserPasswordDTO: UpdateUserPasswordDTO) {
    return this.updateUserPasswordUseCase.execute({ id: userId, ...updateUserPasswordDTO })
  }

  @HttpCode(204)
  @Delete("/:id")
  async delete(@Param("id") userId: string) {
    return this.deleteUserUseCase.execute({ id: userId })
  }
}
