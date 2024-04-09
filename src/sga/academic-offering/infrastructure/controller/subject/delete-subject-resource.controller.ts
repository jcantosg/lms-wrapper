import {
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { DeleteSubjectResourceHandler } from '#academic-offering/applicaton/subject/delete-subject-resource/delete-subject-resource.handler';
import { DeleteSubjectResourceCommand } from '#academic-offering/applicaton/subject/delete-subject-resource/delete-subject-resource.command';

@Controller('subject')
export class DeleteSubjectResourceController {
  constructor(private readonly handler: DeleteSubjectResourceHandler) {}

  @Delete(':subjectId/resource/:resourceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async uploadSubjectResource(
    @Param('subjectId') subjectId: string,
    @Param('resourceId') resourceId: string,
    @Request() req: AuthRequest,
  ) {
    const command = new DeleteSubjectResourceCommand(
      subjectId,
      resourceId,
      req.user,
    );

    await this.handler.handle(command);
  }
}
