import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  getAllSubjectTypes,
  SubjectType,
} from '#academic-offering/domain/enum/subject-type.enum';

export class GetAllSubjectTypesHandler implements QueryEmptyHandler {
  async handle(): Promise<SubjectType[]> {
    return getAllSubjectTypes();
  }
}
