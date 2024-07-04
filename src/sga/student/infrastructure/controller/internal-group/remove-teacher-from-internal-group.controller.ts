import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { removeTeacherFromInternalGroupSchema } from '#student/infrastructure/config/validation-schema/remove-teacher-from-internal-group.schema';
import { RemoveTeacherFromInternalGroupCommand } from '#student/application/remove-teacher-from-internal-group/remove-teacher-from-internal-group.command';
import { RemoveTeacherFromInternalGroupHandler } from '#student/application/remove-teacher-from-internal-group/remove-teacher-from-internal-group.handler';

interface RemoveTeacherFromInternalGroupBody {
  teacherId: string;
}

@Controller('internal-group')
export class RemoveTeacherFromInternalGroupController {
  constructor(
    private readonly handler: RemoveTeacherFromInternalGroupHandler,
  ) {}

  @Put(':id/remove-teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestBodyValidationPipe(removeTeacherFromInternalGroupSchema),
  )
  async removeTeacherFromInternalGroup(
    @Param('id') id: string,
    @Body() body: RemoveTeacherFromInternalGroupBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new RemoveTeacherFromInternalGroupCommand(
      id,
      body.teacherId,
      request.user,
    );

    await this.handler.handle(command);
  }
}
