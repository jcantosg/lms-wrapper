import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { GetAcademicRecordDetailQuery } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.query';

export class GetAcademicRecordDetailHandler implements QueryHandler {
  constructor(private readonly academicRecordGetter: AcademicRecordGetter) {}

  async handle(query: GetAcademicRecordDetailQuery): Promise<AcademicRecord> {
    return await this.academicRecordGetter.getByAdminUser(
      query.id,
      query.adminUser,
    );
  }
}
