import { Subject } from '#academic-offering/domain/entity/subject.entity';

export interface SubjectsByProgramBlockResponse {
  id: string;
  name: string;
  code: string;
  officialCode: string | null;
}

export class GetSubjectsByProgramBlockResponse {
  static create(subjects: Subject[]): SubjectsByProgramBlockResponse[] {
    return subjects.map((subject: Subject) => {
      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        officialCode: subject.officialCode,
      };
    });
  }
}
