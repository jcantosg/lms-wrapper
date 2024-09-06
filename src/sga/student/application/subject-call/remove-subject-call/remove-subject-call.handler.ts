import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { RemoveSubjectCallCommand } from '#student/application/subject-call/remove-subject-call/remove-subject-call.command';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import { SubjectCallAlreadyEvaluatedException } from '#shared/domain/exception/subject-call/subject-call.already-evaluated.exception';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

export class RemoveSubjectCallHandler implements CommandHandler {
  constructor(
    private readonly subjectCallRepository: SubjectCallRepository,
    private readonly subjectCallGetter: SubjectCallGetter,
  ) {}

  async handle(command: RemoveSubjectCallCommand): Promise<void> {
    const subjectCall = await this.subjectCallGetter.getByAdminUser(
      command.subjectCallId,
      command.adminUser,
    );

    if (
      subjectCall.enrollment.academicRecord.status ===
      AcademicRecordStatusEnum.CANCELLED
    ) {
      throw new AcademicRecordCancelledException();
    }

    if (subjectCall.hasFinalGrade()) {
      throw new SubjectCallAlreadyEvaluatedException();
    }

    await this.subjectCallRepository.delete(subjectCall);
  }
}
