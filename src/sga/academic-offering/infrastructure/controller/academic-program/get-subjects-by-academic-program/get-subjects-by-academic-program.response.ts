import { Subject } from '#academic-offering/domain/entity/subject.entity';

export interface SubjectByAcademicProgramResponse {
  id: string;
  name: string;
}

export class GetSubjectsByAcademicProgramResponse {
  static create(
    subjectResponse: Subject[],
  ): SubjectByAcademicProgramResponse[] {
    return subjectResponse.map(
      (subject: Subject): SubjectByAcademicProgramResponse => {
        return {
          id: subject.id,
          name: subject.name,
        };
      },
    );
  }
}
