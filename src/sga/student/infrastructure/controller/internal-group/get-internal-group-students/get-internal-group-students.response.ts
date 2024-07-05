import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { InternalGroupStudent } from '#student/application/get-internal-group-students/get-internal-group-students.handler';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';

export interface GetInternalGroupStudentResponse {
  id: string;
  name: string;
  surname: string;
  surname2: string | null;
  documentNumber: string;
  enrollmentId: string | undefined;
  subjectStatus: SubjectCallStatusEnum | undefined;
  avatar: string | null;
}

export class GetInternalGroupStudentsResponse {
  static create(
    internalGroupStudents: InternalGroupStudent[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetInternalGroupStudentResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: internalGroupStudents.map(
        (
          internalGroupStudent: InternalGroupStudent,
        ): GetInternalGroupStudentResponse => {
          return {
            id: internalGroupStudent.id,
            name: internalGroupStudent.name,
            surname: internalGroupStudent.surname,
            surname2: internalGroupStudent.surname2,
            documentNumber: internalGroupStudent.documentNumber,
            enrollmentId: internalGroupStudent.enrollmentId,
            subjectStatus: internalGroupStudent.subjectStatus,
            avatar: internalGroupStudent.avatar,
          };
        },
      ),
    };
  }
}
