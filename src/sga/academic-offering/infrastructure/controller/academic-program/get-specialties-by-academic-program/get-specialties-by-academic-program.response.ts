import { Subject } from '#academic-offering/domain/entity/subject.entity';

export interface SpecialtyByAcademicProgramResponse {
  id: string;
  name: string;
  internalCode: string;
}

export class GetSpecialtiesByAcademicProgramResponse {
  static create(
    subjectResponse: Subject[],
  ): SpecialtyByAcademicProgramResponse[] {
    return subjectResponse.map(
      (subject: Subject): SpecialtyByAcademicProgramResponse => {
        return {
          id: subject.id,
          name: subject.name,
          internalCode: subject.code,
        };
      },
    );
  }
}
