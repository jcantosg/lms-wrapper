import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { CreateStudentCommand } from '#student/application/create-student/create-student.command';
import { StudentDuplicatedException } from '#student/shared/exception/student-duplicated.exception';
import { StudentDuplicatedEmailException } from '#student/shared/exception/student-duplicated-email.exception';
import { StudentDuplicatedUniversaeEmailException } from '#student/shared/exception/student-duplicated-universae-email.exception';
import {
  DEFAULT_PASSWORD,
  Student,
} from '#shared/domain/entity/student.entity';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';

export class CreateStudentHandler implements CommandHandler {
  constructor(
    private readonly repository: StudentRepository,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

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
      await this.passwordEncoder.encodePassword(DEFAULT_PASSWORD),
    );

    await this.repository.save(student);
  }
}
