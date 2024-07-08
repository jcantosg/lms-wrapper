import { Controller, Param, Put, Request, UseGuards } from '@nestjs/common';
import { UpdateSubjectProgressHandler } from '#student-360/academic-offering/subject/application/update-subject-progress/update-subject-progress.handler';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { UpdateSubjectProgressCommand } from '#student-360/academic-offering/subject/application/update-subject-progress/update-subject-progress.command';
import { MoodleCourseModuleStatus } from '#lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';

@Controller('student-360')
export class UpdateSubjectProgressController {
  constructor(private readonly handler: UpdateSubjectProgressHandler) {}

  @Put('subject-resource/:id/progress')
  @UseGuards(StudentJwtAuthGuard)
  async updateSubjectProgress(
    @Param('id') id: number,
    @Request() auth: StudentAuthRequest,
  ): Promise<void> {
    const command = new UpdateSubjectProgressCommand(
      id,
      auth.user,
      MoodleCourseModuleStatus.COMPLETED,
    );
    await this.handler.handle(command);
  }
}
