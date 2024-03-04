import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { getAllEdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('edae-roles')
export class GetEdaeRolesController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.GESTOR_360,
  )
  findAll() {
    return getAllEdaeRoles();
  }
}
