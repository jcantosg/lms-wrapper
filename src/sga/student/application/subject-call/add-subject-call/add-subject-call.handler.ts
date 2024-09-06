import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AddSubjectCallCommand } from '#student/application/subject-call/add-subject-call/add-subject-call.command';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallDuplicatedException } from '#shared/domain/exception/sga-student/subject-call/subject-call-duplicated.exception';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import {
  isSubjectCallTaken,
  SubjectCallStatusEnum,
} from '#student/domain/enum/enrollment/subject-call-status.enum';
import {
  Enrollment,
  FIRST_CALL_NUMBER,
} from '#student/domain/entity/enrollment.entity';
import { SubjectCallNotTakenException } from '#shared/domain/exception/subject-call/subject-call.not-taken.exception';
import { SubjectCallMaxReachedException } from '#shared/domain/exception/subject-call/subject-call.max-reached.exception';
import { SubjectCallAlreadyPassedException } from '#shared/domain/exception/subject-call/subject-call.already-passed.exception';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

export class AddSubjectCallHandler implements CommandHandler {
  constructor(
    private readonly subjectCallRepository: SubjectCallRepository,
    private readonly enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(command: AddSubjectCallCommand): Promise<void> {
    if (await this.subjectCallRepository.existsById(command.subjectCallId)) {
      throw new SubjectCallDuplicatedException();
    }

    const enrollment = await this.enrollmentGetter.getByAdminUser(
      command.enrollmentId,
      command.adminUser,
    );

    if (
      enrollment.academicRecord.status === AcademicRecordStatusEnum.CANCELLED
    ) {
      throw new AcademicRecordCancelledException();
    }

    const subjectLastCall = enrollment.getLastCall();
    const nextNumberCall = this.calculateNextNumberCall(
      subjectLastCall,
      enrollment,
    );

    const subjectCall = SubjectCall.create(
      command.subjectCallId,
      enrollment,
      nextNumberCall,
      new Date(),
      SubjectCallFinalGradeEnum.ONGOING,
      SubjectCallStatusEnum.ONGOING,
      command.adminUser,
    );
    await this.subjectCallRepository.save(subjectCall);
  }

  private calculateNextNumberCall(
    lastCall: SubjectCall | null,
    enrollment: Enrollment,
  ): number {
    if (!lastCall) {
      return FIRST_CALL_NUMBER;
    }

    if (!isSubjectCallTaken(lastCall)) {
      throw new SubjectCallNotTakenException();
    }

    if (lastCall.callNumber >= enrollment.maxCalls) {
      throw new SubjectCallMaxReachedException();
    }

    if (lastCall.status === SubjectCallStatusEnum.PASSED) {
      throw new SubjectCallAlreadyPassedException();
    }

    if (lastCall.status === SubjectCallStatusEnum.RENOUNCED) {
      return lastCall.callNumber;
    }

    return lastCall.callNumber + 1;
  }
}
