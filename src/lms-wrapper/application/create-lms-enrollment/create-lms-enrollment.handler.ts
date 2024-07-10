import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { CreateLmsEnrollmentCommand } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.command';
import { LmsEnrollment } from '#lms-wrapper/domain/entity/lms-enrollment';

export class CreateLmsEnrollmentHandler implements CommandHandler {
  constructor(private readonly repository: LmsEnrollmentRepository) {}

  async handle(command: CreateLmsEnrollmentCommand): Promise<void> {
    const enrollment = new LmsEnrollment({
      courseId: command.courseId,
      studentId: command.studentId,
      startDate: Math.floor(command.startDate.getTime() / 1000.0),
      endDate: Math.floor(command.endDate.getTime() / 1000.0),
    });
    await this.repository.save(enrollment);
  }
}
