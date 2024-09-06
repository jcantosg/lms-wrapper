import { CommandHandler } from '#shared/domain/bus/command.handler';
import { EditSubjectCallCommand } from '#student/application/subject-call/edit-subject-call/edit-subject-call.command';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

export class EditSubjectCallHandler implements CommandHandler {
  constructor(
    private readonly repository: SubjectCallRepository,
    private readonly subjectCallGetter: SubjectCallGetter,
  ) {}

  async handle(command: EditSubjectCallCommand): Promise<void> {
    const subjectCall = await this.subjectCallGetter.getByAdminUser(
      command.id,
      command.adminUser,
    );

    if (
      subjectCall.enrollment.academicRecord.status ===
      AcademicRecordStatusEnum.CANCELLED
    ) {
      throw new AcademicRecordCancelledException();
    }

    subjectCall.update(
      command.month,
      command.year,
      command.finalGrade,
      command.adminUser,
    );

    await this.repository.save(subjectCall);
  }
}
