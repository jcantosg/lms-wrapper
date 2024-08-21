import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { getStudentCommunicationsSchema } from '#student-360/communications/infrastructure/config/validation-schema/get-communications.schema';
import { GetStudentCommunicationsResponse } from '#student-360/communications/infrastructure/controller/get-communications/get-communications.response';
import { GetStudentCommunicationsHandler } from '#student-360/communications/application/get-student-communications/get-student-communications.handler';
import { GetStudentCommunicationsQuery } from '#student-360/communications/application/get-student-communications/get-student-communications.query';

interface GetStudentCommunicationsQueryParams {
  subject: string;
}

@Controller('student-360')
export class GetStudentCommunicationsController {
  constructor(private readonly handler: GetStudentCommunicationsHandler) {}

  @Get('communications')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getStudentCommunicationsSchema,
    ),
  )
  async getStudentCommunications(
    @Query() queryParams: GetStudentCommunicationsQueryParams,
    @Request() req: StudentAuthRequest,
  ) {
    const query = new GetStudentCommunicationsQuery(
      queryParams.subject,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetStudentCommunicationsResponse.create(response);
  }
}
