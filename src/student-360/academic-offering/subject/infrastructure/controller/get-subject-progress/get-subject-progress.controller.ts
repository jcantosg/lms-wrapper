import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetSubjectProgressHandler } from '#student-360/academic-offering/subject/application/get-subject-progress/get-subject-progress.handler';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetSubjectProgressQuery } from '#student-360/academic-offering/subject/application/get-subject-progress/get-subject-progress.query';
import { GetSubjectProgressResponse } from '#student-360/academic-offering/subject/infrastructure/controller/get-subject-progress/get-subject-progress.response';

@Controller('student-360')
export class GetSubjectProgressController {
  constructor(private readonly handler: GetSubjectProgressHandler) {}

  @Get('subject/:id/progress')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getSubjectProgress(
    @Param('id') id: string,
    @Request() request: StudentAuthRequest,
  ): Promise<GetSubjectProgressResponse> {
    const query = new GetSubjectProgressQuery(id, request.user);
    const progress = await this.handler.handle(query);

    return GetSubjectProgressResponse.create(progress);
  }
}
