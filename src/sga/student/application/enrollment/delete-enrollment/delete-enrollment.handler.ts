import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { DeleteEnrollmentCommand } from '#student/application/enrollment/delete-enrollment/delete-enrollment.command';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { EnrollmentSubjectCallsTakenException } from '#shared/domain/exception/academic-offering/enrollment.subject-calls-taken.exception';

export class DeleteEnrollmentHandler implements CommandHandler {
  constructor(
    private readonly enrollmentGetter: EnrollmentGetter,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly subjectCallRepository: SubjectCallRepository,
  ) {}

  async handle(command: DeleteEnrollmentCommand): Promise<void> {
    const enrollment = await this.enrollmentGetter.get(command.enrollmentId);
    if (enrollment.isEnrollmentTaken()) {
      throw new EnrollmentSubjectCallsTakenException();
    }
    for (const call of enrollment.calls) {
      await this.subjectCallRepository.delete(call);
    }
    await this.enrollmentRepository.delete(enrollment);
  }
}
