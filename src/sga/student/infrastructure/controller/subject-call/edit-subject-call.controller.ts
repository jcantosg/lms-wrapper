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
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { EditSubjectCallHandler } from '#student/application/subject-call/edit-subject-call/edit-subject-call.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditSubjectCallCommand } from '#student/application/subject-call/edit-subject-call/edit-subject-call.command';
import { editSubjectCallSchema } from '#student/infrastructure/config/validation-schema/edit-subject-call.schema';

interface EditSubjectCallBody {
  month: MonthEnum;
  year: number;
  finalGrade: SubjectCallFinalGradeEnum;
}

@Controller('subject-call')
export class EditSubjectCallController {
  constructor(private readonly handler: EditSubjectCallHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(editSubjectCallSchema))
  async editSubjectCall(
    @Param('id') id: string,
    @Body() body: EditSubjectCallBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new EditSubjectCallCommand(
      id,
      body.month,
      body.year,
      body.finalGrade,
      req.user,
    );

    await this.handler.handle(command);
  }
}
