import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export interface SubjectBusinessUnitResponse {
  id: string;
  name: string;
}

export interface SubjectEvaluationTypeResponse {
  id: string;
  name: string;
}

export interface TeacherSubjectResponse {
  id: string;
  name: string;
  surname1: string;
  surname2: string | null;
  avatar: string | null;
}

export interface SubjectResponse {
  id: string;
  name: string;
  code: string;
  officialCode: string | null;
  image: string | null;
  modality: SubjectModality;
  evaluationType: SubjectEvaluationTypeResponse | null;
  type: SubjectType;
  businessUnit: SubjectBusinessUnitResponse;
  isRegulated: boolean;
  teachers: TeacherSubjectResponse[];
}

export class GetSubjectResponse {
  static create(subject: Subject): SubjectResponse {
    return {
      id: subject.id,
      businessUnit: {
        id: subject.businessUnit.id,
        name: subject.businessUnit.name,
      },
      code: subject.code,
      evaluationType: subject.evaluationType
        ? {
            id: subject.evaluationType.id,
            name: subject.evaluationType.name,
          }
        : null,
      image: subject.image,
      isRegulated: subject.isRegulated,
      modality: subject.modality,
      name: subject.name,
      officialCode: subject.officialCode,
      type: subject.type,
      teachers: subject.teachers.map((teacher: EdaeUser) => ({
        id: teacher.id,
        name: teacher.name,
        surname1: teacher.surname1,
        surname2: teacher.surname2,
        avatar: teacher.avatar,
      })),
    };
  }
}
