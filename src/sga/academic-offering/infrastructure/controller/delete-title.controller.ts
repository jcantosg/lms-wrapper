import {
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { DeleteTitleHandler } from '#academic-offering/applicaton/delete-title/delete-title.handler';
import { DeleteTitleCommand } from '#academic-offering/applicaton/delete-title/delete-title.command';

@Controller('title')
export class DeleteTitleController {
  constructor(private readonly handler: DeleteTitleHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async deleteTitle(@Param('id') id: string, @Request() req: AuthRequest) {
    const command = new DeleteTitleCommand(
      id,
      req.user.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    await this.handler.handle(command);
  }
}
