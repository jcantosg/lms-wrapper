import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetStudentAcademicRecordsQuery } from '#/student/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.query';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { GetStudentAcademicRecordsCriteria } from '#/student/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.criteria';

export class GetStudentAcademicRecordsHandler implements QueryHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
  ) {}

  async handle(
    query: GetStudentAcademicRecordsQuery,
  ): Promise<AcademicRecord[]> {
    const criteria = new GetStudentAcademicRecordsCriteria(query);
    const response = await this.academicRecordRepository.matching(criteria);

    return response.sort((first: AcademicRecord, second: AcademicRecord) => {
      if (
        first.academicProgram.academicPeriods[0].periodBlocks[0].startDate <
        second.academicProgram.academicPeriods[0].periodBlocks[0].endDate
      ) {
        return -1;
      } else return 0;
    });
  }
}
