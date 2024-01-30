import {
  Controller,
  Put,
  UseGuards,
  UsePipes,
  Request,
  Param,
  Body,
} from '@nestjs/common';
import { EditVirtualCampusHandler } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.handler';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { editVirtualCampusSchema } from '../config/validation-schema/edit-virtual-campus.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditVirtualCampusCommand } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.command';

type EditVirtualCampusEndpointBody = {
  name: string;
  code: string;
  countryId: string;
  isActive: boolean;
};

@Controller('virtual-campus')
export class EditVirtualCampusController {
  constructor(private handler: EditVirtualCampusHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Put(':id')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editVirtualCampusSchema),
  )
  async editVirtualCampus(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: EditVirtualCampusEndpointBody,
  ) {
    const command: EditVirtualCampusCommand = new EditVirtualCampusCommand(
      id,
      body.name,
      body.code,
      req.user,
      body.isActive,
    );

    await this.handler.handle(command);
  }
}
