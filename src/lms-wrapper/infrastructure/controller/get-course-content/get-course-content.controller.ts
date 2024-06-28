import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetLmsCourseContentHandler } from '#/lms-wrapper/application/get-lms-course-content/get-lms-course-content.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { GetLmsCourseContentQuery } from '#/lms-wrapper/application/get-lms-course-content/get-lms-course-content.query';
import { GetCourseContentResponse } from '#/lms-wrapper/infrastructure/controller/get-course-content/get-course-content.response';

@Controller('wrapper')
export class GetCourseContentController {
  constructor(private readonly handler: GetLmsCourseContentHandler) {}

  @Get('subject/:id/content/:contentId')
  @UseGuards(StudentJwtAuthGuard)
  async getCourseContent(
    @Param('id') id: string,
    @Param('contentId') contentId: number,
  ): Promise<GetCourseContentResponse> {
    const query = new GetLmsCourseContentQuery(id, contentId);
    const lmsModule = await this.handler.handle(query);

    return GetCourseContentResponse.create(lmsModule);
  }
}
