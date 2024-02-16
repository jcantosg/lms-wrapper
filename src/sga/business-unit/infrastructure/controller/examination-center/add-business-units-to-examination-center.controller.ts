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
import { AddBusinessUnitsToExaminationCenterHandler } from '#business-unit/application/examination-center/add-business-units-to-examination-center/add-business-units-to-examination-center.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AddBusinessUnitsToExaminationCenterSchema } from '#business-unit/infrastructure/config/validation-schema/add-business-units-to-examination-center.schema';
import { AddBusinessUnitsToExaminationCenterCommand } from '#business-unit/application/examination-center/add-business-units-to-examination-center/add-business-units-to-examination-center.command';

type AddBusinessUnitsToExaminationCenterEndpointBody = {
  businessUnits: string[];
};

@Controller('examination-center')
export class AddBusinessUnitsToExaminationCenterController {
  constructor(private handler: AddBusinessUnitsToExaminationCenterHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  @Put(':id/add-business-unit')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(AddBusinessUnitsToExaminationCenterSchema),
  )
  async addBusinessUnitsToExaminationCenter(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: AddBusinessUnitsToExaminationCenterEndpointBody,
  ): Promise<void> {
    const command: AddBusinessUnitsToExaminationCenterCommand =
      new AddBusinessUnitsToExaminationCenterCommand(
        id,
        req.user,
        body.businessUnits,
      );

    await this.handler.handle(command);
  }
}
