import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EditBusinessUnitHandler } from '#business-unit/application/business-unit/edit-business-unit/edit-business-unit.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditBusinessUnitCommand } from '#business-unit/application/business-unit/edit-business-unit/edit-business-unit.command';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/edit-business-unit.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';

type EditBusinessUnitEndpointBody = {
  name: string;
  code: string;
  countryId: string;
  isActive: boolean;
};

@Controller('business-unit')
export class EditBusinessUnitController {
  constructor(private handler: EditBusinessUnitHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Put(':id')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editBusinessUnitSchema),
  )
  async editBusinessUnit(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: EditBusinessUnitEndpointBody,
  ): Promise<void> {
    const command: EditBusinessUnitCommand = new EditBusinessUnitCommand(
      id,
      body.name,
      body.code,
      body.countryId,
      req.user,
      body.isActive,
    );
    await this.handler.handle(command);
  }
}
