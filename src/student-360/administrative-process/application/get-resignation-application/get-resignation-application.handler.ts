import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetResignationApplicationQuery } from '#student-360/administrative-process/application/get-resignation-application/get-resignation-application.query';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';

export class GetResignationApplicationHandler implements QueryHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly baseURL: string,
  ) {}

  async handle(query: GetResignationApplicationQuery): Promise<string> {
    const academicRecord = await this.academicRecordRepository.get(
      query.academicRecordId,
    );
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }

    const businessUnitCode = academicRecord.businessUnit.code;

    return `${this.baseURL}/administrative-process/resignation-applications/${businessUnitCode}-resignation-application.pdf`;
  }
}
