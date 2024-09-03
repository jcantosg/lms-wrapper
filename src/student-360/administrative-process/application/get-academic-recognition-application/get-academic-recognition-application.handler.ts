import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetAcademicRecognitionApplicationQuery } from '#student-360/administrative-process/application/get-academic-recognition-application/get-academic-recognition-application.query';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';

export class GetAcademicRecognitionApplicationHandler implements QueryHandler {
  constructor(
    private readonly academicRecordRepository: AcademicRecordRepository,
    private readonly baseURL: string,
  ) {}

  async handle(query: GetAcademicRecognitionApplicationQuery): Promise<string> {
    const academicRecord = await this.academicRecordRepository.get(
      query.academicRecordId,
    );
    if (!academicRecord) {
      throw new AcademicRecordNotFoundException();
    }

    const businessUnitCode = academicRecord.businessUnit.code;

    return `${this.baseURL}/administrative-process/academic-recognition-applications/${businessUnitCode}-academic-recognition-application.pdf`;
  }
}
