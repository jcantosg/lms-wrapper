import { Subject } from '#academic-offering/domain/entity/subject.entity';

export interface SubjectTeacherChatResponse {
  id: string;
  name: string;
  code: string;
}

export class GetSubjectsTeacherChatResponse {
  static create(subjects: Subject[]): SubjectTeacherChatResponse[] {
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
    }));
  }
}
