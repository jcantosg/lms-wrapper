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
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { RemoveEdaeUserFromSubjectHandler } from '#academic-offering/applicaton/subject/remove-edae-from-subject/remove-edae-user-from-subject.handler';
import { RemoveEdaeUserFromSubjectCommand } from '#academic-offering/applicaton/subject/remove-edae-from-subject/remove-edae-user-from-subject.command';
import { removeEdaeUserFromSubjectSchema } from '#academic-offering/infrastructure/config/validation-schema/remove-edae-user-from-subject.schema';

interface RemoveEdaeUserFromSubjectEndpointBody {
  edaeUser: string;
}

@Controller('subject')
export class RemoveEdaeUserFromSubjectController {
  constructor(private handler: RemoveEdaeUserFromSubjectHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @Put(':id/remove-edae-user')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(removeEdaeUserFromSubjectSchema),
  )
  async removeEdaeUserFromSubject(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: RemoveEdaeUserFromSubjectEndpointBody,
  ): Promise<void> {
    const command = new RemoveEdaeUserFromSubjectCommand(
      id,
      body.edaeUser,
      req.user,
    );

    await this.handler.handle(command);
  }
}
