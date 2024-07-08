import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { CreateLmsStudentCommand } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.command';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';

export class CreateLmsStudentHandler implements CommandHandler {
  constructor(private readonly repository: LmsStudentRepository) {}

  async handle(command: CreateLmsStudentCommand): Promise<LmsStudent> {
    return await this.repository.save(
      command.username,
      command.firstName,
      command.lastName,
      command.email,
      command.password,
    );
  }
}
