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
import { AddEdaeUsersToSubjectHandler } from '#academic-offering/applicaton/subject/add-edae-users-to-subject/add-edae-users-to-subject.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AddEdaeUsersToSubjectCommand } from '#academic-offering/applicaton/subject/add-edae-users-to-subject/add-edae-users-to-subject.command';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { addEdaeUsersToSubjectSchema } from '#academic-offering/infrastructure/config/validation-schema/add-edae-users-to-subject.schema';

interface AddEdaeUsersToSubjectEndpointBody {
  edaeUsers: string[];
}

@Controller('subject')
export class AddEdaeUsersToSubjectController {
  constructor(private handler: AddEdaeUsersToSubjectHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @Put(':id/add-edae-user')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addEdaeUsersToSubjectSchema),
  )
  async AddEdaeUsersToSubject(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: AddEdaeUsersToSubjectEndpointBody,
  ): Promise<void> {
    const command = new AddEdaeUsersToSubjectCommand(
      id,
      body.edaeUsers,
      req.user,
    );

    await this.handler.handle(command);
  }
}
