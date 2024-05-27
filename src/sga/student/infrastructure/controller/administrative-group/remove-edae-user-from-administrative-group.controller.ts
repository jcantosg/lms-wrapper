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
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { RemoveEdaeUserFromAdministrativeGroupCommand } from '#student/application/administrative-group/remove-edae-user-from-administrative-group/remove-edae-user-from-administrative-group.command';
import { RemoveEdaeUserFromAdministrativeGroupHandler } from '#student/application/administrative-group/remove-edae-user-from-administrative-group/remove-edae-user-from-administrative-group.handler';
import { removeEdaeUserFromAdministrativeGroupSchema } from '#student/infrastructure/config/validation-schema/remove-edae-user-from-administrative-group.schema';

interface RemoveEdaeUserFromAdministrativeGroupEndpointBody {
  edaeUserId: string;
}

@Controller('administrative-group')
export class RemoveEdaeUserFromAdministrativeGroupController {
  constructor(
    private readonly handler: RemoveEdaeUserFromAdministrativeGroupHandler,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.JEFATURA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SECRETARIA,
  )
  @Put(':id/remove-edae-user')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(
      removeEdaeUserFromAdministrativeGroupSchema,
    ),
  )
  async removeEdaeUserFromAdministrativeGroup(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: RemoveEdaeUserFromAdministrativeGroupEndpointBody,
  ): Promise<void> {
    const command = new RemoveEdaeUserFromAdministrativeGroupCommand(
      id,
      body.edaeUserId,
      req.user,
    );

    await this.handler.handle(command);
  }
}
