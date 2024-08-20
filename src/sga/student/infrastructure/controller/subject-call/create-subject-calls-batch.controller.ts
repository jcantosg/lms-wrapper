import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createSubjectCallsBatchSchema } from '#student/infrastructure/config/validation-schema/create-subject-call-batch.schema';
import { CreateSubjectCallsBatchCommand } from '#student/application/subject-call/create-subject-calls-batch/create-subject-calls-batch.command';
import { CreateSubjectCallsBatchHandler } from '#student/application/subject-call/create-subject-calls-batch/create-subject-calls-batch.handler';

interface CreateSubjectCallsBatchBodyParams {
  businessUnitId: string;
  academicPeriodId: string;
  academicProgramIds: string[];
}

@Controller('subject-call')
export class CreateSubjectCallsBatchController {
  constructor(private readonly handler: CreateSubjectCallsBatchHandler) {}

  @Post('batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(new JoiRequestBodyValidationPipe(createSubjectCallsBatchSchema))
  async createSubjectCallsBatch(
    @Body() body: CreateSubjectCallsBatchBodyParams,
    @Request() request: AuthRequest,
  ) {
    const command = new CreateSubjectCallsBatchCommand(
      body.businessUnitId,
      body.academicPeriodId,
      body.academicProgramIds,
      request.user,
    );

    await this.handler.handle(command);
  }
}
