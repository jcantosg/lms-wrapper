import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { editAdministrativeProcessSchema } from '#student/infrastructure/config/validation-schema/edit-administrative-process.schema';
import { EditAdministrativeProcessCommand } from '#student/application/administrative-process/edit-administrative-process/edit-administrative-process.command';
import { EditAdministrativeProcessHandler } from '#student/application/administrative-process/edit-administrative-process/edit-administrative-process.handler';

interface EditAdministrativeProcessBody {
  status: AdministrativeProcessStatusEnum;
}

@Controller('administrative-process')
export class EditAdministrativeProcessController {
  constructor(private readonly handler: EditAdministrativeProcessHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editAdministrativeProcessSchema),
  )
  async EditAdministrativeProcess(
    @Param('id') id: string,
    @Body() body: EditAdministrativeProcessBody,
  ): Promise<void> {
    const command = new EditAdministrativeProcessCommand(id, body.status);

    await this.handler.handle(command);
  }
}
