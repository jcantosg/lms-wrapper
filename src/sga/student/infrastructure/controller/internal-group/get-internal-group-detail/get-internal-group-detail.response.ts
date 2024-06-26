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
  subject: { id: string; name: string };
  academicProgram: { id: string; name: string };
  academicPeriod: { id: string; name: string };
  businessUnit: { id: string; name: string };
  startDate: Date;
  isDefaultGroup: boolean;
  teachers: TeacherResponse[];
}

export class GetInternalGroupDetailResponse {
  static create(internalGroup: InternalGroup): InternalGroupDetailResponse {
    return {
      id: internalGroup.id,
      code: internalGroup.code,
      subject: {
        id: internalGroup.subject.id,
        name: internalGroup.subject.name,
      },
      academicProgram: {
        id: internalGroup.academicProgram.id,
        name: internalGroup.academicProgram.name,
      },
      academicPeriod: {
        id: internalGroup.academicPeriod.id,
        name: internalGroup.academicPeriod.name,
      },
      businessUnit: {
        id: internalGroup.businessUnit.id,
        name: internalGroup.businessUnit.name,
      },
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
