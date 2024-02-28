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
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AddBusinessUnitsSchema } from '#/sga/shared/infrastructure/config/validation-schema/add-business-units.schema';
import { AddBusinessUnitsToEdaeUserCommand } from '#edae-user/application/add-business-units-to-edae-user/add-business-units-to-edae-user.command';
import { AddBusinessUnitsToEdaeUserHandler } from '#edae-user/application/add-business-units-to-edae-user/add-business-units-to-edae-user.handler';

type AddBusinessUnitsToEdaeUserEndpointBody = {
  businessUnits: string[];
};

@Controller('edae-user')
export class AddBusinessUnitsToEdaeUserController {
  constructor(private handler: AddBusinessUnitsToEdaeUserHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @Put(':id/add-business-unit')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(AddBusinessUnitsSchema),
  )
  async addBusinessUnitsToEdaeUser(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: AddBusinessUnitsToEdaeUserEndpointBody,
  ): Promise<void> {
    const command: AddBusinessUnitsToEdaeUserCommand =
      new AddBusinessUnitsToEdaeUserCommand(id, req.user, body.businessUnits);

    await this.handler.handle(command);
  }
}
