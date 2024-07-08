import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { addStudentToInternalGroupSchema } from '#student/infrastructure/config/validation-schema/add-student-to-internal-group.schema';
import { AddStudentToInternalGroupHandler } from '#student/application/add-student-to-internal-group/add-student-to-internal-group.handler';
import { AddStudentToInternalGroupCommand } from '#student/application/add-student-to-internal-group/add-student-to-internal-group.command';

interface AddStudentToInternalGroupBody {
  studentIds: string[];
}

@Controller('internal-group')
export class AddStudentToInternalGroupController {
  constructor(private readonly handler: AddStudentToInternalGroupHandler) {}

  @Put(':id/add-student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(addStudentToInternalGroupSchema))
  async addStudentToInternalGroup(
    @Param('id') id: string,
    @Body() body: AddStudentToInternalGroupBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new AddStudentToInternalGroupCommand(
      id,
      body.studentIds,
      req.user,
    );

    await this.handler.handle(command);
  }
}
