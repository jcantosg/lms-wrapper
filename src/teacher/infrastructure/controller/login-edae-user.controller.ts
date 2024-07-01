import { Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Authenticator } from '#/teacher/infrastructure/service/edae-user-authenticator.service';
import { LocalAuthGuard } from '#/teacher/infrastructure/auth/local-auth.guard';
import { loginEdaeUserSchema } from '#/teacher/infrastructure/config/validation-schema/login-edae-user.schema';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';

@Controller('edae-360')
export class LoginEdaeUserController {
  constructor(private readonly authenticator: Authenticator) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(loginEdaeUserSchema))
  async login(@Req() req: EdaeUserAuthRequest) {
    return await this.authenticator.login(req.user);
  }
}
