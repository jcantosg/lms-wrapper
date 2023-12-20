import { RegisterAdminUserCommand } from '#admin-user/application/register-admin-user/register-admin-user.command';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { registerAdminUserSchema } from '#admin-user/infrastructure/config/validation-schema/register-admin-user.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

@Controller('auth')
export class RegisterAdminUserController {
  constructor(
    private readonly registerAdminUserHandler: RegisterAdminUserHandler,
  ) {}

  @Post('register')
  @UsePipes(new JoiRequestBodyValidationPipe(registerAdminUserSchema))
  async register(@Body() body: any) {
    const command = new RegisterAdminUserCommand(
      body.id,
      body.email,
      body.password,
      body.roles,
    );

    return await this.registerAdminUserHandler.handle(command);
  }
}
