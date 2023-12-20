import { LocalAuthGuard } from '#admin-user/infrastructure/auth/local-auth.guard';
import { loginAdminUserSchema } from '#admin-user/infrastructure/config/validation-schema/login-user.schema';
import { Authenticator } from '#admin-user/infrastructure/service/authenticator.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';

@Controller('auth')
export class LoginAdminUserController {
  constructor(private readonly authenticator: Authenticator) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new JoiRequestBodyValidationPipe(loginAdminUserSchema))
  async login(@Req() req: AuthRequest) {
    return await this.authenticator.login(req.user);
  }
}
