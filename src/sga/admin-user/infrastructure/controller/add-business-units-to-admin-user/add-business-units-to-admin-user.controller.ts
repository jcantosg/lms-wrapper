import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AddBusinessUnitsToAdminUserHandler } from '#admin-user/application/add-business-units-to-admin-user/add-business-units-to-admin-user.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AddBusinessUnitsToAdminUserCommand } from '#admin-user/application/add-business-units-to-admin-user/add-business-units-to-admin-user.command';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { addBusinessUnitsToAdminUserSchema } from '#admin-user/infrastructure/config/validation-schema/add-business-units-to-admin-user.schema';

interface AddBusinessUnitsToAdminUserBody {
  businessUnits: string[];
}

@Controller('admin-user')
export class AddBusinessUnitsToAdminUserController {
  constructor(private readonly handler: AddBusinessUnitsToAdminUserHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @Put(':id/add-business-unit')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addBusinessUnitsToAdminUserSchema),
  )
  async AddBusinessUnitToAdminUser(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: AddBusinessUnitsToAdminUserBody,
  ) {
    const command = new AddBusinessUnitsToAdminUserCommand(
      id,
      body.businessUnits,
      req.user,
    );

    await this.handler.handle(command);
  }
}
