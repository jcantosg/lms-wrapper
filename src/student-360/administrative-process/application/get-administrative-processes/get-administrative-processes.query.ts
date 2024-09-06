import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetAllStudentAdministrativeProcessesQuery implements Query {
  constructor(public readonly student: Student) {}
}
