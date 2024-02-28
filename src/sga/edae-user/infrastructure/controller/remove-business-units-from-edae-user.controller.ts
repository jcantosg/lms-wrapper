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
import { RemoveBusinessUnitsFromEdaeUserHandler } from '#edae-user/application/remove-business-units-from-edae-user/remove-business-units-from-edae-user.handler';
import { RemoveBusinessUnitsFromEdaeUserCommand } from '#edae-user/application/remove-business-units-from-edae-user/remove-business-units-from-edae-user.command';
import { RemoveBusinessUnitsSchema } from '#/sga/shared/infrastructure/config/validation-schema/remove-business-units.schema';

type RemoveBusinessUnitsFromEdaeUserEndpointBody = {
  businessUnit: string;
};

@Controller('edae-user')
export class RemoveBusinessUnitsFromEdaeUserController {
  constructor(private handler: RemoveBusinessUnitsFromEdaeUserHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @Put(':id/remove-business-unit')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(RemoveBusinessUnitsSchema),
  )
  async removeBusinessUnitsFromEdaeUser(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: RemoveBusinessUnitsFromEdaeUserEndpointBody,
  ): Promise<void> {
    const command: RemoveBusinessUnitsFromEdaeUserCommand =
      new RemoveBusinessUnitsFromEdaeUserCommand(
        id,
        req.user,
        body.businessUnit,
      );

    await this.handler.handle(command);
  }
}
