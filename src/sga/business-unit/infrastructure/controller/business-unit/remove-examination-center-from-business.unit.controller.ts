import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { RemoveExaminationCentersFromBusinessUnitHandler } from '#business-unit/application/business-unit/remove-examination-center-from-business-unit/remove-examination-center-from-business-unit.handler';
import { removeExaminationCentersFromBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/remove-examination-center-from-business-unit.schema';
import { RemoveExaminationCentersFromBusinessUnitCommand } from '#business-unit/application/business-unit/remove-examination-center-from-business-unit/remove-examination-center-from-business-unit.command';

type RemoveExaminationCentersToBusinessUnitEndpointBody = {
  examinationCenter: string;
};

@Controller('business-unit')
export class RemoveExaminationCenterFromBusinessUnitController {
  constructor(
    private handler: RemoveExaminationCentersFromBusinessUnitHandler,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @Put(':id/remove-examination-center')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(
      removeExaminationCentersFromBusinessUnitSchema,
    ),
  )
  async addExaminationCentersToBusinessUnit(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: RemoveExaminationCentersToBusinessUnitEndpointBody,
  ): Promise<void> {
    const command: RemoveExaminationCentersFromBusinessUnitCommand =
      new RemoveExaminationCentersFromBusinessUnitCommand(
        id,
        req.user,
        body.examinationCenter,
      );

    await this.handler.handle(command);
  }
}
