import { Subject } from '#academic-offering/domain/entity/subject.entity';

export interface SubjectByBusinessUnitResponse {
  id: string;
  name: string;
  code: string;
  avatar: string | null;
}

export class GetSubjectsByBusinessUnitResponse {
  static create(subjectResponse: Subject[]): SubjectByBusinessUnitResponse[] {
    return subjectResponse.map(
      (subject: Subject): SubjectByBusinessUnitResponse => {
        return {
          id: subject.id,
          name: subject.name,
          code: subject.code,
          avatar: subject.image,
        };
      },
    );
  }
}
