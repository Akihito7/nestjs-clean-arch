import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SignupUseCase } from '../application/use-cases/signup.use-case';
import { SignupDTO } from './dtos/signup.dto';
import { Signln } from '../application/use-cases/signln.use-case';
import { SignlnDTO } from './dtos/signln.dto';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { ListUserDTO } from './dtos/list-user.dto';
import { ListUsers } from '../application/use-cases/list-users.use-case';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UpdateUser } from '../application/use-cases/update-user.use-case';
import { UpdateUserPassword } from '../application/use-cases/update-user-password.use-case';
import { UpdateUserPasswordDTO } from './dtos/update-user-password.dto';
import { DeleteUser } from '../application/use-cases/delete-user.use-case';
import { UserCollectionPresenter, UserPresenter } from './presenters/user.presenter';
import { IUserOutput } from '../application/dtos/user-output';
import { AuthService } from '@/shared/infrastructure/auth/auth.service';
import { AuthGuard } from '@/shared/infrastructure/auth/guards/auth.guard';

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

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: IUserOutput) {
    return new UserPresenter(output)
  }

  static userListToResponse(output: ListUsers.Output) {
    return new UserCollectionPresenter(output)
  }

  @HttpCode(201)
  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    const output = await this.signupUseCase.execute(signupDTO)
    return UsersController.userToResponse(output)
  }

  @HttpCode(200)
  @Post('signln')
  async signln(@Body() signlnDTO: SignlnDTO) {
    const output = await this.signlnUseCase.execute(signlnDTO);
    return this.authService.generateToken(output.id!.toString());
  }


  @UseGuards(AuthGuard)
  @Get("/:id")
  async findOne(@Param("id") userId: string) {
    const output = await this.getUserUseCase.execute({ id: userId });
    return UsersController.userToResponse(output);
  }

  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchableDTO: ListUserDTO) {
    const output = await this.listUserUseCase.execute(searchableDTO);
    return UsersController.userListToResponse(output)
  }

  @UseGuards(AuthGuard)
  @Put("/:id")
  async update(
    @Param("id") userId: string,
    @Body() updateUserDTO: UpdateUserDTO
  ) {
    const output = await this.updateUserUseCase.execute({ id: userId, ...updateUserDTO });
    return UsersController.userToResponse(output);
  }

  @UseGuards(AuthGuard)
  @Patch("/:id")
  async updatePassword(
    @Param("id") userId: string,
    @Body() updateUserPasswordDTO: UpdateUserPasswordDTO) {
    const output = await this.updateUserPasswordUseCase.execute({ id: userId, ...updateUserPasswordDTO });
    return UsersController.userToResponse(output);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete("/:id")
  async delete(@Param("id") userId: string) {
    return this.deleteUserUseCase.execute({ id: userId })
  }
}
