import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { StudentStatus } from '#shared/domain/enum/student-status.enum';

type AdministrativeGroupStudent = {
  id: string;
  name: string;
  surname: string;
  identityDocument: {
    identityDocumentType: string | null;
    identityDocumentNumber: string | null;
  };
  avatar: string | null;
  status: StudentStatus;
};

type AdministrativeGroupTeacher = {
  id: string;
  avatar: string | null;
  name: string;
  surname1: string;
};

type AdministrativeGroupDetail = {
  id: string;
  code: string;
  academicProgram: {
    id: string;
    name: string;
  };
  block: number;
  academicPeriod: {
    id: string;
    name: string;
  };
  startMonth: MonthEnum;
  businessUnit: {
    id: string;
    name: string;
  };
  students: AdministrativeGroupStudent[];
  teachers: AdministrativeGroupTeacher[];
};

export class GetAdministrativeGroupResponse {
  static create(
    administrativeGroup: AdministrativeGroup,
  ): AdministrativeGroupDetail {
    return {
      id: administrativeGroup.id,
      code: administrativeGroup.code,
      academicProgram: {
        id: administrativeGroup.academicProgram.id,
        name: administrativeGroup.academicProgram.name,
      },
      block: administrativeGroup.periodBlock.blockNumber(),
      academicPeriod: {
        id: administrativeGroup.academicPeriod.id,
        name: administrativeGroup.academicPeriod.name,
      },
      startMonth: administrativeGroup.periodBlock.startMonth,
      businessUnit: {
        id: administrativeGroup.businessUnit.id,
        name: administrativeGroup.businessUnit.name,
      },
      students: administrativeGroup.students.map((student) => ({
        id: student.id,
        name: student.name,
        surname: student.surname,
        identityDocument: {
          identityDocumentType:
            student?.identityDocument?.identityDocumentType ?? null,
          identityDocumentNumber:
            student?.identityDocument?.identityDocumentNumber ?? null,
        },
        avatar: student.avatar ?? null,
        status: student.status,
      })),

      teachers: administrativeGroup.teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        surname1: teacher.surname1,
        avatar: teacher.avatar ?? null,
      })),
    };
  }
}
