import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAccessQualificationsHandler } from '#/student/application/get-access-qualifications/get-access-qualifications.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Controller('student')
export class GetAccessQualificationsController {
  constructor(private readonly handler: GetAccessQualificationsHandler) {}

  @Get('access-qualification')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async getAccessQualifications() {
    return await this.handler.handle();
  }
}
