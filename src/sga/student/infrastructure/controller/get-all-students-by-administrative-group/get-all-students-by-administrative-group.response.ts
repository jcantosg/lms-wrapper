import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';

import { StudentAdministrativeGroup } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.handler';
import { StudentAdministrativeGroupStatusEnum } from '#student/domain/enum/student-administrative-group-status.enum';

export interface GetStudentByAdministrativeGroupResponse {
  id: string;
  name: string;
  surname: string;
  avatar: string | null;
  identityDocument: {
    identityDocumentType: string;
    identityDocumentNumber: string;
  } | null;
  academicRecordId: string;
  status: StudentAdministrativeGroupStatusEnum;
}

export class GetAllStudentsByAdministrativeGroupResponse {
  static create(
    studentsAdminGroup: StudentAdministrativeGroup[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetStudentByAdministrativeGroupResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: studentsAdminGroup.map(
        (
          studentAdminGroup: StudentAdministrativeGroup,
        ): GetStudentByAdministrativeGroupResponse => {
          return {
            id: studentAdminGroup.student.id,
            name: studentAdminGroup.student.name,
            surname: studentAdminGroup.student.surname,
            avatar: studentAdminGroup.student.avatar,
            identityDocument: studentAdminGroup?.student?.identityDocument
              ?.identityDocumentNumber
              ? {
                  identityDocumentType:
                    studentAdminGroup.student.identityDocument
                      .identityDocumentType,
                  identityDocumentNumber:
                    studentAdminGroup.student.identityDocument
                      .identityDocumentNumber,
                }
              : null,
            academicRecordId: studentAdminGroup.academicRecord.id,
            status: studentAdminGroup.status,
          };
        },
      ),
    };
  }
}
