import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { GetLmsCourseContentHandler } from '#/lms-wrapper/application/lms-course/get-lms-course-content/get-lms-course-content.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { GetLmsCourseContentQuery } from '#/lms-wrapper/application/lms-course/get-lms-course-content/get-lms-course-content.query';
import { GetCourseContentResponse } from '#/lms-wrapper/infrastructure/controller/get-course-content/get-course-content.response';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';

@Controller('wrapper')
export class GetCourseContentController {
  constructor(private readonly handler: GetLmsCourseContentHandler) {}

  @Get('subject/:id/content/:contentId')
  @UseGuards(StudentJwtAuthGuard)
  async getCourseContent(
    @Param('id') id: string,
    @Param('contentId') contentId: number,
    @Request() request: StudentAuthRequest,
  ): Promise<GetCourseContentResponse> {
    const query = new GetLmsCourseContentQuery(id, contentId, request.user);
    const lmsModule = await this.handler.handle(query);

    return GetCourseContentResponse.create(lmsModule);
  }
}
