import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

interface TeacherMeResponseBody {
  id: string;
  name: string;
  surname1: string;
  surname2: string | null;
  email: string;
  avatar: string | null;
}

export class TeacherMeResponse {
  static create(teacher: EdaeUser): TeacherMeResponseBody {
    return {
      id: teacher.id,
      name: teacher.name,
      surname1: teacher.surname1,
      surname2: teacher.surname2,
      email: teacher.email,
      avatar: teacher.avatar,
    };
  }
}
