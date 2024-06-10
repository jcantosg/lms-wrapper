import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetStudentAcademicRecordQuery } from '#/student/academic-offering/academic-record/application/get-student-academic-record/get-student-academic-record.query';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';

export class GetStudentAcademicRecordHandler implements QueryHandler {
  constructor(private readonly academicRecordGetter: AcademicRecordGetter) {}

  async handle(query: GetStudentAcademicRecordQuery): Promise<AcademicRecord> {
    return await this.academicRecordGetter.getStudentAcademicRecord(
      query.academicRecordId,
      query.student,
    );
  }
}
