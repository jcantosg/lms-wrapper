import { Subject } from '#academic-offering/domain/entity/subject.entity';

interface SubjectNotEnrolledResponse {
  id: string;
  name: string;
  code: string;
}

export class GetSubjectsNotEnrolledResponse {
  static create(subjects: Subject[]): SubjectNotEnrolledResponse[] {
    return subjects.map((subject: Subject) => {
      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
      };
    });
  }
}
