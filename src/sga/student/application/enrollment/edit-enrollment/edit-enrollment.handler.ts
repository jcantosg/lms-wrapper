import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { EditEnrollmentCommand } from '#student/application/enrollment/edit-enrollment/edit-enrollment.command';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

export class EditEnrollmentHandler implements CommandHandler {
  constructor(
    private readonly repository: EnrollmentRepository,
    private readonly enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(command: EditEnrollmentCommand): Promise<void> {
    const enrollment: Enrollment = await this.enrollmentGetter.get(
      command.enrollmentId,
    );

    if (
      enrollment.academicRecord.status === AcademicRecordStatusEnum.CANCELLED
    ) {
      throw new AcademicRecordCancelledException();
    }

    enrollment.update(command.type, command.visibility, command.maxCalls);
    enrollment.updated();

    await this.repository.save(enrollment);
  }
}
