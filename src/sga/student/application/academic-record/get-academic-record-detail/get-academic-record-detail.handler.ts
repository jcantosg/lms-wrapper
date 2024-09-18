import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { GetAcademicRecordDetailQuery } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.query';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { StudentAdministrativeGroupByAcademicRecordGetter } from '#student/domain/service/student-administrative-group-by-academic-record.getter.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

export interface AcademicRecordDetail {
  academicRecord: AcademicRecord;
  administrativeGroup: AdministrativeGroup | null;
  totalHoursCompleted: number;
}

export class GetAcademicRecordDetailHandler implements QueryHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentAdministrativeGroupByAcademicRecordGetter: StudentAdministrativeGroupByAcademicRecordGetter,
    private readonly enrollmentGetter: EnrollmentGetter,
  ) {}

  async handle(
    query: GetAcademicRecordDetailQuery,
  ): Promise<AcademicRecordDetail> {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      query.id,
      query.adminUser,
    );
    const enrollments =
      await this.enrollmentGetter.getByAcademicRecord(academicRecord);
    const filteredEnrollments = enrollments.filter((enrollment) =>
      enrollment.calls.some(
        (call) => call.status === SubjectCallStatusEnum.PASSED,
      ),
    );

    const totalHoursCompleted = filteredEnrollments.reduce(
      (total, enrollment) => total + (enrollment.subject?.hours ?? 0),
      0,
    );

    const administrativeGroup =
      await this.studentAdministrativeGroupByAcademicRecordGetter.get(
        academicRecord.id,
      );

    return { academicRecord, administrativeGroup, totalHoursCompleted };
  }
}
