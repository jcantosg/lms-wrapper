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
import { removeStudentFromInternalGroupSchema } from '#student/infrastructure/config/validation-schema/remove-student-from-internal-group.schema';
import { RemoveStudentFromInternalGroupHandler } from '#student/application/remove-student-from-internal-group/remove-student-from-internal-group.handler';
import { RemoveStudentFromInternalGroupCommand } from '#student/application/remove-student-from-internal-group/remove-student-from-internal-group.command';

interface RemoveStudentFromInternalGroupBody {
  studentId: string;
}

@Controller('internal-group')
export class RemoveStudentFromInternalGroupController {
  constructor(
    private readonly handler: RemoveStudentFromInternalGroupHandler,
  ) {}

  @Put(':id/remove-student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestBodyValidationPipe(removeStudentFromInternalGroupSchema),
  )
  async removeStudentFromInternalGroup(
    @Param('id') id: string,
    @Body() body: RemoveStudentFromInternalGroupBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new RemoveStudentFromInternalGroupCommand(
      id,
      body.studentId,
      request.user,
    );

    await this.handler.handle(command);
  }
}
