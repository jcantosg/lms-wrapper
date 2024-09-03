import { Query } from '#shared/domain/bus/query';
import { Student } from '#shared/domain/entity/student.entity';

export class GetStudentCommunicationsQuery implements Query {
  constructor(
    public readonly subject: string,
    public readonly student: Student,
  ) {}
}
