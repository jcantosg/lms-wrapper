import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { DeleteLmsStudentCommand } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.command';

export class DeleteLmsStudentHandler implements CommandHandler {
  constructor(private readonly repository: LmsStudentRepository) {}

  async handle(command: DeleteLmsStudentCommand): Promise<void> {
    await this.repository.delete(command.id);
  }
}
