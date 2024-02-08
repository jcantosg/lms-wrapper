import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetUserRolesHandler } from '#admin-user/application/get-user-roles/get-user-roles.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetUserRolesQuery } from '#admin-user/application/get-user-roles/get-user-roles.query';

@Controller('admin-user')
export class GetRolesController {
  constructor(private readonly handler: GetUserRolesHandler) {}

  @Get('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  async getRoles(@Request() req: AuthRequest): Promise<string[]> {
    const query = new GetUserRolesQuery(req.user.roles);

    return this.handler.handle(query);
  }
}
