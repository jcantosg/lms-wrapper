import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export interface SubjectResponse {
  id: string;
  name: string;
  code: string;
  officialCode: string | null;
  modality: SubjectModality;
  evaluationType: {
    id: string;
    name: string;
  } | null;
  type: SubjectType;
  businessUnit: {
    id: string;
    name: string;
  };
  isRegulated: boolean;
}

export class GetSubjectResponse {
  static create(subject: Subject): SubjectResponse {
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      officialCode: subject.officialCode,
      modality: subject.modality,
      evaluationType: subject.evaluationType
        ? {
            id: subject.evaluationType.id,
            name: subject.evaluationType.name,
          }
        : null,
      type: subject.type,
      businessUnit: {
        id: subject.businessUnit.id,
        name: subject.businessUnit.name,
      },
      isRegulated: subject.isRegulated,
    };
  }
}
