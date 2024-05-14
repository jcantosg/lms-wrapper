import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateEnrollmentHandler } from '#student/application/enrollment/create-enrollment/create-enrollment.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { createEnrollmentSchema } from '#student/infrastructure/config/validation-schema/create-enrollment.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { EnrollmentSubject } from '#student/application/enrollment/create-enrollment/enrollment-subject';
import { CreateEnrollmentCommand } from '#student/application/enrollment/create-enrollment/create-enrollment.command';

interface CreateEnrollmentBodyParams {
  ids: EnrollmentSubject[];
  academicRecordId: string;
}

@Controller('enrollment')
export class CreateEnrollmentController {
  constructor(private readonly handler: CreateEnrollmentHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createEnrollmentSchema))
  async createEnrollment(
    @Body() body: CreateEnrollmentBodyParams,
    @Request() request: AuthRequest,
  ) {
    const command = new CreateEnrollmentCommand(
      body.ids,
      body.academicRecordId,
      request.user,
    );

    await this.handler.handle(command);
  }
}
