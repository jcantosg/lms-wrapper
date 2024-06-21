import { InternalGroup } from '#student/domain/entity/internal-group-entity';

export interface TeacherResponse {
  id: string;
  name: string;
  surname1: string;
  avatar: string;
  isDefault: boolean;
}

export interface InternalGroupDetailResponse {
  id: string;
  code: string;
  subjectName: string;
  academicProgramName: string;
  academicPeriodName: string;
  businessUnitName: string;
  startDate: Date;
  isDefaultGroup: boolean;
  teachers: TeacherResponse[];
}

export class GetInternalGroupDetailResponse {
  static create(internalGroup: InternalGroup): InternalGroupDetailResponse {
    return {
      id: internalGroup.id,
      code: internalGroup.code,
      subjectName: internalGroup.subject.name,
      academicProgramName: internalGroup.academicProgram.name,
      academicPeriodName: internalGroup.academicPeriod.name,
      businessUnitName: internalGroup.businessUnit.name,
      startDate: internalGroup.createdAt,
      isDefaultGroup: internalGroup.isDefault,
      teachers: internalGroup.teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        surname1: teacher.surname1,
        avatar: teacher.avatar || '',
        isDefault: internalGroup.defaultTeacher?.id === teacher.id,
      })),
    };
  }
}
