import { SubjectEdaeUsers } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.handler';

export interface SubjectEdaeUsersResponse {
  id: string;
  name: string;
  surname: string;
  surname2: string | null;
  avatar: string | null;
  isDefaultTeacher: boolean;
}

export class GetAllSubjectEdaeUsersResponse {
  static create(
    subjectEdaeUsers: SubjectEdaeUsers,
  ): SubjectEdaeUsersResponse[] {
    return subjectEdaeUsers.teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      surname: teacher.surname1,
      surname2: teacher.surname2,
      avatar: teacher.avatar,
      isDefaultTeacher:
        !!subjectEdaeUsers.defaultTeacher &&
        teacher.id === subjectEdaeUsers.defaultTeacher.id,
    }));
  }
}
