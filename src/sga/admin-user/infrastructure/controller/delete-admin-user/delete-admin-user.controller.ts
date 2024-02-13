import { Controller, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { DeleteAdminUserHandler } from '#admin-user/application/delete-admin-user/delete-admin-user.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { DeleteAdminUserCommand } from '#admin-user/application/delete-admin-user/delete-admin-user.command';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Controller('admin-user')
export class DeleteAdminUserController {
  constructor(private readonly handler: DeleteAdminUserHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  async deleteAdminUser(
    @Param('id') id: string,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new DeleteAdminUserCommand(id, req.user);
    await this.handler.handle(command);
  }
}
