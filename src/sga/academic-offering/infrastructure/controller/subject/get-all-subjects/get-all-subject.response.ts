import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import {
  GetSubjectResponse,
  SubjectResponse,
} from '#academic-offering/infrastructure/controller/subject/get-all-subjects/get-subject.response';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class GetAllSubjectsResponse {
  static create(
    subjects: Subject[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<SubjectResponse> {
    return {
      items: subjects.map((subject) => GetSubjectResponse.create(subject)),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
