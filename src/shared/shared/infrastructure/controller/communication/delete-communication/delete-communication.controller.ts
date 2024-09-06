import { Controller, Delete, Param, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { DeleteCommunicationCommand } from '#shared/application/communication/delete-communication/delete-communication.command';
import { DeleteCommunicationHandler } from '#shared/application/communication/delete-communication/delete-communication.handler';

@Controller('communication')
export class DeleteCommunicationController {
  constructor(private readonly handler: DeleteCommunicationHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async deleteCommunication(@Param('id') id: string): Promise<void> {
    await this.handler.handle(new DeleteCommunicationCommand(id));
  }
}
