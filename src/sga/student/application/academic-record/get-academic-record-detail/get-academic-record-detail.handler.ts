import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { GetAcademicRecordDetailQuery } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.query';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { StudentAdministrativeGroupByAcademicRecordGetter } from '#student/domain/service/student-administrative-group-by-academic-record.getter.service';

export interface AcademicRecordDetail {
  academicRecord: AcademicRecord;
  administrativeGroup: AdministrativeGroup | null;
}

export class GetAcademicRecordDetailHandler implements QueryHandler {
  constructor(
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly studentAdministrativeGroupByAcademicRecordGetter: StudentAdministrativeGroupByAcademicRecordGetter,
  ) {}

  async handle(
    query: GetAcademicRecordDetailQuery,
  ): Promise<AcademicRecordDetail> {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      query.id,
      query.adminUser,
    );

    const administrativeGroup =
      await this.studentAdministrativeGroupByAcademicRecordGetter.get(
        academicRecord.id,
      );

    return { academicRecord, administrativeGroup };
  }
}
