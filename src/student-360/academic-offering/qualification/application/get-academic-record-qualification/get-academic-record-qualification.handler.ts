import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { GetAcademicRecordQualificationQuery } from '#student-360/academic-offering/qualification/application/get-academic-record-qualification/get-academic-record-qualification.query';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';

export class GetAcademicRecordQualificationHandler implements QueryHandler {
  constructor(
    private academicRecordGetter: AcademicRecordGetter,
    private enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(
    query: GetAcademicRecordQualificationQuery,
  ): Promise<SubjectCall[]> {
    const academicRecord =
      await this.academicRecordGetter.getStudentAcademicRecord(
        query.academicRecordId,
        query.student,
      );
    const enrollments =
      await this.enrollmentGetter.getByAcademicRecord(academicRecord);
    const subjectCalls: SubjectCall[] = [];
    for (const enrollment of enrollments) {
      const lastCall = enrollment.getLastCall();
      if (lastCall) {
        subjectCalls.push(lastCall);
      }
    }

    return subjectCalls;
  }
}
