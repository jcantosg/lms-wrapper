import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getCoursingSubjectStudentsSchema } from '#student/infrastructure/config/validation-schema/get-coursing-subject-students.schema';
import {
  GetCoursingSubjectStudentResponse,
  GetCoursingSubjectStudentsResponse,
} from '#student/infrastructure/controller/get-coursing-subject-students/get-coursing-subject-students.response';
import { GetCoursingSubjectStudentsQuery } from '#student/application/get-coursing-subject-students/get-coursing-subject-students.query';
import { GetCoursingSubjectStudentsHandler } from '#student/application/get-coursing-subject-students/get-coursing-subject-students.handler';

interface GetCoursingSubjectStudentQueryParams {
  subjectId: string;
}

@Controller('student')
export class GetCoursingSubjectStudentsController {
  constructor(private readonly handler: GetCoursingSubjectStudentsHandler) {}

  @Get('find-coursing-subject')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getCoursingSubjectStudentsSchema,
    ),
  )
  async getStudents(
    @Query() params: GetCoursingSubjectStudentQueryParams,
    @Request() request: AuthRequest,
  ): Promise<GetCoursingSubjectStudentResponse[]> {
    const query = new GetCoursingSubjectStudentsQuery(
      params.subjectId,
      request.user,
    );

    const students = await this.handler.handle(query);

    return GetCoursingSubjectStudentsResponse.create(students);
  }
}
