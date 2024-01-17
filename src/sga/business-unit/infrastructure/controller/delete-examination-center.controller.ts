import { DeleteExaminationCenterHandler } from '#business-unit/application/delete-examination-center/delete-examination-center.handler';
import { Controller, Delete, Param, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { DeleteExaminationCenterCommand } from '#business-unit/application/delete-examination-center/delete-examination-center.command';

@Controller('examination-center')
export class DeleteExaminationCenterController {
  constructor(private handler: DeleteExaminationCenterHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Roles(AdminUserRoles.SUPERADMIN)
  async deleteExaminationCenter(@Param('id') id: string): Promise<void> {
    const command = new DeleteExaminationCenterCommand(id);
    await this.handler.handle(command);
  }
}
