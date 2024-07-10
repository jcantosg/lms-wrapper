import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';

export class DeleteLmsEnrollmentHandler implements CommandHandler {
  constructor(private readonly repository: LmsEnrollmentRepository) {}

  async handle(command: DeleteLmsEnrollmentCommand): Promise<void> {
    await this.repository.delete(command.courseId, command.studentId);
  }
}
