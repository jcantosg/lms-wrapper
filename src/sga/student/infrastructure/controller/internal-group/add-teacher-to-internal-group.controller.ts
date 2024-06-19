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
import { addTeacherToInternalGroupSchema } from '#student/infrastructure/config/validation-schema/add-teacher-to-internal-group.schema';
import { AddTeacherToInternalGroupCommand } from '#student/application/add-teacher-to-internal-group/add-teacher-to-internal-group.command';
import { AddTeacherToInternalGroupHandler } from '#student/application/add-teacher-to-internal-group/add-teacher-to-internal-group.handler';

interface AddTeacherToInternalGroupBody {
  teacherId: string;
}

@Controller('internal-group')
export class AddTeacherToInternalGroupController {
  constructor(private readonly handler: AddTeacherToInternalGroupHandler) {}

  @Put(':id/add-teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(addTeacherToInternalGroupSchema))
  async addTeacherToInternalGroup(
    @Param('id') id: string,
    @Body() body: AddTeacherToInternalGroupBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new AddTeacherToInternalGroupCommand(
      id,
      body.teacherId,
      request.user,
    );

    await this.handler.handle(command);
  }
}
