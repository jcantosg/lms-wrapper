import { CommandHandler } from '#shared/domain/bus/command.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { UpdateStudentPasswordCommand } from '#student/application/update-password/update-student-password.command';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { StudentGetter } from '#shared/domain/service/student-getter.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { StudentPasswordUpdatedEvent } from '#student/domain/event/student/student-password-updated.event';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';

export class UpdateStudentPasswordHandler implements CommandHandler {
  constructor(
    private studentGetter: StudentGetter,
    private studentRepository: StudentRepository,
    private passwordEncoder: PasswordEncoder,
    private passwordFormatChecker: PasswordFormatChecker,
    private eventDispatcher: EventDispatcher,
  ) {}

  async handle(command: UpdateStudentPasswordCommand): Promise<void> {
    const student = await this.studentGetter.get(command.studentId);
    this.passwordFormatChecker.check(command.newPassword);
    const passwordEncoded = await this.passwordEncoder.encodePassword(
      command.newPassword,
    );
    student.updatePassword(passwordEncoded, command.adminUser);
    await this.studentRepository.save(student);

    await this.eventDispatcher.dispatch(
      new StudentPasswordUpdatedEvent(student, command.newPassword),
    );
  }
}
