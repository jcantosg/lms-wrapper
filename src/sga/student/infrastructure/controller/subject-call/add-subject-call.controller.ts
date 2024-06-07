import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AddSubjectCallHandler } from '#student/application/subject-call/add-subject-call/add-subject-call.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AddSubjectCallCommand } from '#student/application/subject-call/add-subject-call/add-subject-call.command';
import { addSubjectCallSchema } from '#student/infrastructure/config/validation-schema/add-subject-call.schema';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

interface AddSubjectCallBodyParams {
  subjectCallId: string;
}

@Controller('enrollment')
export class AddSubjectCallController {
  constructor(private readonly handler: AddSubjectCallHandler) {}

  @Post(':enrollmentId/add-subject-call')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(addSubjectCallSchema))
  async addSubjectCall(
    @Body() body: AddSubjectCallBodyParams,
    @Param('enrollmentId') enrollmentId: string,
    @Request() request: AuthRequest,
  ) {
    const command = new AddSubjectCallCommand(
      enrollmentId,
      body.subjectCallId,
      request.user,
    );

    await this.handler.handle(command);
  }
}
