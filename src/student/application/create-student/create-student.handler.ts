import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRepository } from '#/student/domain/repository/student.repository';
import { CreateStudentCommand } from '#/student/application/create-student/create-student.command';
import { StudentDuplicatedException } from '#/student/shared/exception/student-duplicated.exception';
import { StudentDuplicatedEmailException } from '#/student/shared/exception/student-duplicated-email.exception';
import { StudentDuplicatedUniversaeEmailException } from '#/student/shared/exception/student-duplicated-universae-email.exception';
import { Student } from '#/student/domain/entity/student.entity';

export class CreateStudentHandler implements CommandHandler {
  constructor(private readonly repository: StudentRepository) {}

  async handle(command: CreateStudentCommand): Promise<void> {
    if (await this.repository.existsById(command.id)) {
      throw new StudentDuplicatedException();
    }
    if (await this.repository.existsByEmail(command.id, command.email)) {
      throw new StudentDuplicatedEmailException();
    }
    if (
      await this.repository.existsByUniversaeEmail(
        command.id,
        command.universaeEmail,
      )
    ) {
      throw new StudentDuplicatedUniversaeEmailException();
    }
    const student = Student.createFromSGA(
      command.id,
      command.name,
      command.surname,
      command.surname2,
      command.email,
      command.universaeEmail,
      command.adminUser,
    );

    await this.repository.save(student);
  }
}
