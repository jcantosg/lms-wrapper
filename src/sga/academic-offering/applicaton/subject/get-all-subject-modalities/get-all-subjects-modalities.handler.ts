import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  getAllSubjectModalities,
  SubjectModality,
} from '#academic-offering/domain/enum/subject-modality.enum';

export class GetAllSubjectsModalitiesHandler implements QueryEmptyHandler {
  async handle(): Promise<SubjectModality[]> {
    return getAllSubjectModalities();
  }
}
