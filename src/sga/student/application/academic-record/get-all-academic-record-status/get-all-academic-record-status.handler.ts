import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  AcademicRecordStatusEnum,
  getAllAcademicRecordStatusEnum,
} from '#student/domain/enum/academic-record-status.enum';

export class GetAllAcademicRecordStatusHandler implements QueryEmptyHandler {
  async handle(): Promise<AcademicRecordStatusEnum[]> {
    return getAllAcademicRecordStatusEnum();
  }
}
