import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { RemoveBusinessUnitFromAdminUserHandler } from '#admin-user/application/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.handler';
import { removeBusinessUnitFromAdminUserSchema } from '#admin-user/infrastructure/config/validation-schema/remove-business-unit-from-admin-user.schema';
import { RemoveBusinessUnitFromAdminUserCommand } from '#admin-user/application/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.command';

interface AddBusinessUnitsToAdminUserBody {
  businessUnit: string;
}

@Controller('admin-user')
export class RemoveBusinessUnitFromAdminUserController {
  constructor(
    private readonly handler: RemoveBusinessUnitFromAdminUserHandler,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @Put(':id/remove-business-unit')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(removeBusinessUnitFromAdminUserSchema),
  )
  async AddBusinessUnitToAdminUser(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: AddBusinessUnitsToAdminUserBody,
  ) {
    const command = new RemoveBusinessUnitFromAdminUserCommand(
      id,
      body.businessUnit,
      req.user,
    );

    await this.handler.handle(command);
  }
}
