import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { editInternalGroupSchema } from '#student/infrastructure/config/validation-schema/edit-internal-group.schema';
import { EditInternalGroupCommand } from '#student/application/edit-internal-group/edit-internal-group.command';
import { EditInternalGroupHandler } from '#student/application/edit-internal-group/edit-internal-group.handler';

interface EditInternalGroupBody {
  code: string;
  isDefault: boolean;
}

@Controller('internal-group')
export class EditInternalGroupController {
  constructor(private readonly handler: EditInternalGroupHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(editInternalGroupSchema))
  async editInternalGroup(
    @Param('id') id: string,
    @Body() body: EditInternalGroupBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new EditInternalGroupCommand(
      id,
      body.code,
      body.isDefault,
      req.user,
    );

    await this.handler.handle(command);
  }
}
