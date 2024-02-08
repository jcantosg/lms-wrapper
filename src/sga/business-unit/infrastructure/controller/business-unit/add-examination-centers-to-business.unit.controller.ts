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
import { AddExaminationCentersToBusinessUnitHandler } from '#business-unit/application/business-unit/add-examination-centers-to-business-unit/add-examination-centers-to-business-unit.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AddExaminationCentersToBusinessUnitCommand } from '#business-unit/application/business-unit/add-examination-centers-to-business-unit/add-examination-centers-to-business-unit.command';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { addExaminationCentersToBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/add-examination-centers-to-business-unit.schema';

type AddExaminationCentersToBusinessUnitEndpointBody = {
  examinationCenters: string[];
};

@Controller('business-unit')
export class AddExaminationCentersToBusinessUnitController {
  constructor(private handler: AddExaminationCentersToBusinessUnitHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Put(':id/add-examination-center')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addExaminationCentersToBusinessUnitSchema),
  )
  async addExaminationCentersToBusinessUnit(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: AddExaminationCentersToBusinessUnitEndpointBody,
  ): Promise<void> {
    const command: AddExaminationCentersToBusinessUnitCommand =
      new AddExaminationCentersToBusinessUnitCommand(
        id,
        req.user,
        body.examinationCenters,
      );

    await this.handler.handle(command);
  }
}
