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
import { DeleteExaminationCallCommand } from '#academic-offering/applicaton/examination-call/delete-examination-call/delete-examination-call.command';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { DeleteExaminationCallHandler } from '#academic-offering/applicaton/examination-call/delete-examination-call/delete-examination-call.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';

@Controller('examination-call')
export class DeleteExaminationCallController {
  constructor(private readonly handler: DeleteExaminationCallHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async deleteExaminationCall(
    @Param('id') id: string,
    @Request() req: AuthRequest,
  ) {
    const command = new DeleteExaminationCallCommand(
      id,
      req.user.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    await this.handler.handle(command);
  }
}
