import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsCourseRepository } from '#lms-wrapper/domain/repository/lms-course.repository';
import { UpdateCourseModuleProgressCommand } from '#lms-wrapper/application/lms-course/update-course-module-progress/update-course-module-progress.command';

export class UpdateCourseModuleProgressHandler implements CommandHandler {
  constructor(private readonly repository: LmsCourseRepository) {}

  async handle(command: UpdateCourseModuleProgressCommand): Promise<void> {
    await this.repository.updateCourseModuleStatus(
      command.courseModuleId,
      command.studentId,
      command.newStatus,
    );
  }
}
