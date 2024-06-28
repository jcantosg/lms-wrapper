import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { GetSubjectHandler } from '#student-360/academic-offering/subject/application/get-subject/get-subject.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';
import { GetSubjectResponse } from '#student-360/academic-offering/subject/infrastructure/controller/get-subject/get-subject.response';

@Controller('student-360')
export class GetSubjectController {
  constructor(private readonly handler: GetSubjectHandler) {}

  @Get('subject/:id')
  @UseGuards(StudentJwtAuthGuard)
  async getSubject(
    @Param('id') id: string,
    @Request() req: StudentAuthRequest,
  ): Promise<GetSubjectResponse> {
    const query = new GetSubjectQuery(id, req.user);
    const subject = await this.handler.handle(query);

    return GetSubjectResponse.create(subject);
  }
}
