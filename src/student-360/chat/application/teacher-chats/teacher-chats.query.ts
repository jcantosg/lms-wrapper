import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class TeacherChatsQuery implements Query {
  constructor(public readonly student: Student) {}
}
