import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { GetIdentityDocumentTypesHandler } from '#admin-user/application/get-identity-document-types/get-document-types.handler';

@Controller('admin-user')
export class GetIdentityDocumentTypesController {
  constructor(private readonly handler: GetIdentityDocumentTypesHandler) {}

  @Get('identity-document-type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
  )
  async getIdentityDocumentTypes(): Promise<string[]> {
    return this.handler.handle();
  }
}
