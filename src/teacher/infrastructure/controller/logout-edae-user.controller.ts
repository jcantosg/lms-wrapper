import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ExpireEdaeUserRefreshTokenHandler } from '#/teacher/application/edae-user/expire-edae-user-refresh-token/expire-edae-user-refresh-token.handler';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { ExpireEdaeUserRefreshTokenCommand } from '#/teacher/application/edae-user/expire-edae-user-refresh-token/expire-edae-user-refresh-token.command';

@Controller('edae-360')
export class LogoutEdaeUserController {
  constructor(private readonly handler: ExpireEdaeUserRefreshTokenHandler) {}

  @Post('logout')
  @UseGuards(EdaeUserJwtAuthGuard)
  async logoutEdaeUser(@Request() req: EdaeUserAuthRequest): Promise<void> {
    const command = new ExpireEdaeUserRefreshTokenCommand(req.user.id);

    await this.handler.handle(command);
  }
}
