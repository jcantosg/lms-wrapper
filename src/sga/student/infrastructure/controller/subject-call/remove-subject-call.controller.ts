import {
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RemoveSubjectCallHandler } from '#student/application/subject-call/remove-subject-call/remove-subject-call.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { RemoveSubjectCallCommand } from '#student/application/subject-call/remove-subject-call/remove-subject-call.command';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';

@Controller('subject-call')
export class RemoveSubjectCallController {
  constructor(private readonly handler: RemoveSubjectCallHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async removeSubjectCall(
    @Param('id') id: string,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new RemoveSubjectCallCommand(id, req.user);

    await this.handler.handle(command);
  }
}
