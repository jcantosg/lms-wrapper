import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { changePasswordSchema } from '#admin-user/infrastructure/config/validation-schema/change-password.schema';
import { ChangePasswordHandler } from '#admin-user/application/change-password/change-password.handler';
import { ChangePasswordCommand } from '#admin-user/application/change-password/change-password.command';

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

@Controller('profile')
export class ChangePasswordController {
  constructor(private readonly handler: ChangePasswordHandler) {}

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(changePasswordSchema))
  async ChangePassword(
    @Body() body: ChangePasswordBody,
    @Request() request: AuthRequest,
  ) {
    const command = new ChangePasswordCommand(
      request.user,
      body.currentPassword,
      body.newPassword,
    );
    await this.handler.handle(command);
  }
}
