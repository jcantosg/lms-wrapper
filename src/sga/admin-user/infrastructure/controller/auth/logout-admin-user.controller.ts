import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { ExpireRefreshTokenCommand } from '#admin-user/application/expire-refresh-token/expire-refresh-token.command';
import { ExpireRefreshTokenHandler } from '#admin-user/application/expire-refresh-token/expire-refresh-token.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class LogoutAdminUserController {
  constructor(
    private readonly expireRefreshTokenHandler: ExpireRefreshTokenHandler,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async login(@Req() req: AuthRequest) {
    const command = new ExpireRefreshTokenCommand(req.user.id);

    return await this.expireRefreshTokenHandler.handle(command);
  }
}
