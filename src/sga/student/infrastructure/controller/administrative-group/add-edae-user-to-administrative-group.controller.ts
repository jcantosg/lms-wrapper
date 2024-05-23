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
import { AddEdaeUserToAdministrativeGroupHandler } from '#student/application/administrative-group/add-teacher-to-administrative-group/add-edae-user-to-administrative-group.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AddEdaeUserToAdministrativeGroupCommand } from '#student/application/administrative-group/add-teacher-to-administrative-group/add-edae-user-to-administrative-group.command';
import { addEdaeUsersToAdministrativeGroupSchema } from '#student/infrastructure/config/validation-schema/add-edae-user-to-administrative-group.schema';

interface AddTeacherToAdministrativeGroupEndpointBody {
  edaeUserIds: string[];
}

@Controller('administrative-group')
export class AddEdaeUserToAdministrativeGroupController {
  constructor(
    private readonly handler: AddEdaeUserToAdministrativeGroupHandler,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.JEFATURA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SECRETARIA,
  )
  @Put(':id/add-edae-user')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addEdaeUsersToAdministrativeGroupSchema),
  )
  async addEdaeUserToAdministrativeGroup(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: AddTeacherToAdministrativeGroupEndpointBody,
  ): Promise<void> {
    const command = new AddEdaeUserToAdministrativeGroupCommand(
      id,
      body.edaeUserIds,
      req.user,
    );

    await this.handler.handle(command);
  }
}
