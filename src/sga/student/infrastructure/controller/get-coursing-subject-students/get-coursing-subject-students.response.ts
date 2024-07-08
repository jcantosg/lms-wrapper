import { Student } from '#shared/domain/entity/student.entity';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';

export interface GetCoursingSubjectStudentResponse {
  id: string;
  name: string;
  surname: string;
  surname2: string;
  identityDocument: IdentityDocumentValues | null;
  avatar: string | null;
}

export class GetCoursingSubjectStudentsResponse {
  static create(students: Student[]): GetCoursingSubjectStudentResponse[] {
    return students.map((student) => ({
      id: student.id,
      name: student.name,
      surname: student.surname,
      surname2: student.surname2,
      identityDocument: student.identityDocument
        ? student.identityDocument.value
        : null,
      avatar: student.avatar,
    }));
  }
}
