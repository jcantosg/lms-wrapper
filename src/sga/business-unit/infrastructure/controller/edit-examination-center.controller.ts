import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { EditExaminationCenterHandler } from '#business-unit/application/edit-examination-center/edit-examination-center.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { editExaminationCenterSchema } from '#business-unit/infrastructure/config/validation-schema/edit-examination-center.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditExaminationCenterCommand } from '#business-unit/application/edit-examination-center/edit-examination-center.command';

type EditExaminationCenterEndpointBody = {
  name: string;
  code: string;
  address: string;
  businessUnits: string[];
  isActive: boolean;
};

@Controller('examination-center')
export class EditExaminationCenterController {
  constructor(private handler: EditExaminationCenterHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Put(':id')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editExaminationCenterSchema),
  )
  async editExaminationCenter(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: EditExaminationCenterEndpointBody,
  ) {
    const command: EditExaminationCenterCommand =
      new EditExaminationCenterCommand(
        id,
        body.name,
        body.code,
        body.address,
        body.businessUnits,
        req.user.id,
        body.isActive,
      );

    await this.handler.handle(command);
  }
}
