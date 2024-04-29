import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  AcademicRecordModalityEnum,
  getAllAcademicRecordModalities,
} from '#academic-offering/domain/enum/academic-record-modality.enum';

export class GetAllAcademicRecordModalitiesHandler
  implements QueryEmptyHandler
{
  async handle(): Promise<AcademicRecordModalityEnum[]> {
    return getAllAcademicRecordModalities();
  }
}
