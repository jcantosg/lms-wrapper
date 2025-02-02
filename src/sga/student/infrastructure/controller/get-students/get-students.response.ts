import { Student } from '#shared/domain/entity/student.entity';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export interface GetStudentResponse {
  id: string;
  name: string;
  surname: string;
  universaeEmail: string;
  avatar: string | null;
  identityDocument: IdentityDocumentValues | null;
  businessUnit: {
    id: string;
    name: string;
  }[];
  academicProgram: {
    id: string;
    name: string;
    code: string;
  }[];
  isDefense: boolean;
  createdAt: Date;
}

export class GetStudentsResponse {
  static create(
    students: Student[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetStudentResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: students.map((student: Student): GetStudentResponse => {
        return {
          id: student.id,
          name: student.name,
          surname: student.surname,
          universaeEmail: student.universaeEmail,
          avatar: student.avatar,
          identityDocument: student.identityDocument?.value ?? null,
          businessUnit: this.getUniqueBusinessUnits(student.academicRecords),
          academicProgram: student.academicRecords.map(
            (academicRecord: AcademicRecord) => {
              return {
                id: academicRecord.academicProgram.id,
                name: academicRecord.academicProgram.name,
                code: academicRecord.academicProgram.code,
              };
            },
          ),
          isDefense: student.isDefense,
          createdAt: student.createdAt,
        };
      }),
    };
  }

  private static getUniqueBusinessUnits(academicRecords: AcademicRecord[]) {
    const businessUnitNames = new Set<string>();

    return academicRecords
      .map((academicRecord: AcademicRecord) => {
        return {
          id: academicRecord.businessUnit.id,
          name: academicRecord.businessUnit.name,
        };
      })
      .filter((businessUnit) => {
        if (businessUnitNames.has(businessUnit.name)) {
          return false;
        }
        businessUnitNames.add(businessUnit.name);

        return true;
      });
  }
}
