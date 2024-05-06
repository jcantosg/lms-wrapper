import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SetDefaultTeacherToSubjectHandler } from '#academic-offering/applicaton/subject/set-default-teacher-to-subject/set-default-teacher-to-subject.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { SetDefaultTeacherToSubjectCommand } from '#academic-offering/applicaton/subject/set-default-teacher-to-subject/set-default-teacher-to-subject.command';
import { setDefaultTeacherToSubjectSchema } from '#academic-offering/infrastructure/config/validation-schema/set-default-teacher-to-subject.schema';

interface SetDefaultTeacherToSubjectEndpointBody {
  teacherId: string;
}

@Controller('subject')
export class SetDefaultTeacherToSubjectController {
  constructor(private handler: SetDefaultTeacherToSubjectHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @Put(':id/default-teacher')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(setDefaultTeacherToSubjectSchema),
  )
  async setDefaultTeacherToSubject(
    @Param('id') id: string,
    @Body() body: SetDefaultTeacherToSubjectEndpointBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new SetDefaultTeacherToSubjectCommand(
      id,
      body.teacherId,
      req.user,
    );

    await this.handler.handle(command);
  }
}
