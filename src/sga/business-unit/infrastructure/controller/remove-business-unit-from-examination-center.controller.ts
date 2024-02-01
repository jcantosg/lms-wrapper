import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { RemoveBusinessUnitFromExaminationCenterHandler } from '#business-unit/application/remove-business-unit-from-examination-center/remove-business-unit-from-examination-center.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { RemoveBusinessUnitFromExaminationCenterCommand } from '#business-unit/application/remove-business-unit-from-examination-center/remove-business-unit-from-examination-center.command';
import { RemoveBusinessUnitFromExaminationCenterSchema } from '#business-unit/infrastructure/config/validation-schema/remove-business-unit-from-examination-center.schema';

type RemoveBusinessUnitFromExaminationCenterEndpointBody = {
  businessUnit: string;
};

@Controller('examination-center')
export class RemoveBusinessUnitFromExaminationCenterController {
  constructor(
    private handler: RemoveBusinessUnitFromExaminationCenterHandler,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Put(':id/remove-business-unit')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(
      RemoveBusinessUnitFromExaminationCenterSchema,
    ),
  )
  async addBusinessUnitsToExaminationCenter(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: RemoveBusinessUnitFromExaminationCenterEndpointBody,
  ): Promise<void> {
    const command: RemoveBusinessUnitFromExaminationCenterCommand =
      new RemoveBusinessUnitFromExaminationCenterCommand(
        id,
        req.user,
        body.businessUnit,
      );

    await this.handler.handle(command);
  }
}
