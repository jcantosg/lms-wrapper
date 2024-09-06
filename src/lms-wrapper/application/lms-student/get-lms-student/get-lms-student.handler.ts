import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';
import { GetLmsStudentCommand } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.command';

export class GetLmsStudentHandler implements CommandHandler {
  constructor(private readonly repository: LmsStudentRepository) {}

  async handle(command: GetLmsStudentCommand): Promise<LmsStudent | null> {
    return await this.repository.getByEmail(
      command.universaeEmail,
      command.email,
    );
  }
}
