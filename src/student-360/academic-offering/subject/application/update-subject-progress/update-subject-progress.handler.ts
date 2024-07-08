import { CommandHandler } from '#shared/domain/bus/command.handler';
import { UpdateCourseModuleProgressHandler } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.handler';
import { UpdateSubjectProgressCommand } from '#student-360/academic-offering/subject/application/update-subject-progress/update-subject-progress.command';
import { UpdateCourseModuleProgressCommand } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.command';
import { LmsStudentNotInStudentException } from '#lms-wrapper/domain/exception/lms-student-not-in-student.exception';

export class UpdateSubjectProgressHandler implements CommandHandler {
  constructor(
    private readonly updateCourseProgressHandler: UpdateCourseModuleProgressHandler,
  ) {}

  async handle(command: UpdateSubjectProgressCommand): Promise<void> {
    if (!command.student.lmsStudent) {
      throw new LmsStudentNotInStudentException();
    }
    await this.updateCourseProgressHandler.handle(
      new UpdateCourseModuleProgressCommand(
        command.courseModuleId,
        command.student.lmsStudent.value.id,
        command.newStatus,
      ),
    );
  }
}
