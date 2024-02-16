import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAdminUserHandler } from '#admin-user/application/get-admin-user/get-admin-user.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAdminUserQuery } from '#admin-user/application/get-admin-user/get-admin-user.query';
import { GetAdminUserDetailResponse } from '#admin-user/infrastructure/controller/get-admin-user/get-admin-user.response';

@Controller('me')
export class GetAdminUserController {
  constructor(private readonly handler: GetAdminUserHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAdminUser(@Req() req: AuthRequest) {
    const query = new GetAdminUserQuery(req.user.id);
    const adminUser = await this.handler.handle(query);

    return GetAdminUserDetailResponse.create(adminUser);
  }
}
